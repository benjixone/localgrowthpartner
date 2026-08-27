/**
 * Crypto for the LGP dashboard.
 *
 * Wire-compatible with the StaticCrypt payloads already published under /dash/:
 * same three-round PBKDF2 chain, same AES-256-CBC + HMAC-SHA256 envelope, and
 * the same salt. That means the password you already use keeps working, and the
 * encrypted scan reports in /dash/r/ are unaffected.
 *
 * Runs unmodified in the browser and in Node 18+ — both expose WebCrypto as
 * `crypto.subtle`. One implementation shared by the refresher that writes
 * data.enc.json and the page that reads it, so the two can never drift apart.
 *
 * Envelope layout (hex string):
 *   [0,   64)  HMAC-SHA256 of everything after it
 *   [64,  96)  AES-CBC initialisation vector
 *   [96, ...)  ciphertext
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.LGPCrypto = factory();
})(typeof self !== "undefined" ? self : globalThis, function () {
  var webcrypto = typeof crypto !== "undefined" ? crypto : null;
  var subtle = webcrypto && webcrypto.subtle;

  var ALGO = "AES-CBC";
  var IV_BYTES = 16;
  var IV_HEX = IV_BYTES * 2;
  var MAC_HEX = 64;

  function requireSubtle() {
    if (!subtle) {
      throw new Error(
        "WebCrypto is unavailable. The dashboard needs to be served over https " +
          "(or localhost); in Node it needs v18 or newer."
      );
    }
    return subtle;
  }

  function toHex(bytes) {
    var out = "";
    for (var i = 0; i < bytes.length; i++) {
      out += bytes[i].toString(16).padStart(2, "0");
    }
    return out;
  }

  function fromHex(hex) {
    if (typeof hex !== "string" || hex.length % 2 !== 0 || /[^0-9a-f]/i.test(hex)) {
      throw new Error("Malformed payload: expected an even-length hex string.");
    }
    var bytes = new Uint8Array(hex.length / 2);
    for (var i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  function utf8(str) {
    return new TextEncoder().encode(str);
  }

  function pbkdf2(password, salt, iterations, hash) {
    var s = requireSubtle();
    return s
      .importKey("raw", utf8(password), "PBKDF2", false, ["deriveBits"])
      .then(function (key) {
        return s.deriveBits(
          { name: "PBKDF2", hash: hash, iterations: iterations, salt: utf8(salt) },
          key,
          256
        );
      })
      .then(function (bits) {
        return toHex(new Uint8Array(bits));
      });
  }

  /**
   * Password -> 256-bit key, as hex.
   *
   * StaticCrypt raised its iteration count twice over the years and kept the
   * earlier rounds as a prefix rather than invalidating existing links, so the
   * real work factor is 1k SHA-1 + 14k SHA-256 + 585k SHA-256 = 600k. We
   * reproduce the chain exactly; changing it would lock out the current
   * password and the published reports.
   *
   * Deliberately slow (roughly a second in a browser). Cache the result with
   * `rememberKey` rather than re-deriving on every poll.
   */
  function deriveKey(password, salt) {
    return pbkdf2(password, salt, 1000, "SHA-1")
      .then(function (k) {
        return pbkdf2(k, salt, 14000, "SHA-256");
      })
      .then(function (k) {
        return pbkdf2(k, salt, 585000, "SHA-256");
      });
  }

  function sign(message, keyHex) {
    var s = requireSubtle();
    return s
      .importKey("raw", fromHex(keyHex), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
      .then(function (key) {
        return s.sign("HMAC", key, utf8(message));
      })
      .then(function (sig) {
        return toHex(new Uint8Array(sig));
      });
  }

  /** Constant-time-ish compare so a wrong password leaks nothing via timing. */
  function hexEquals(a, b) {
    if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
    var diff = 0;
    for (var i = 0; i < a.length; i++) {
      diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
  }

  function encrypt(plaintext, keyHex) {
    var s = requireSubtle();
    var iv = webcrypto.getRandomValues(new Uint8Array(IV_BYTES));
    return s
      .importKey("raw", fromHex(keyHex), ALGO, false, ["encrypt"])
      .then(function (key) {
        return s.encrypt({ name: ALGO, iv: iv }, key, utf8(plaintext));
      })
      .then(function (ct) {
        var body = toHex(iv) + toHex(new Uint8Array(ct));
        return sign(body, keyHex).then(function (mac) {
          return mac + body;
        });
      });
  }

  /**
   * Rejects with `BAD_PASSWORD` when the HMAC does not match, which is the only
   * signal the caller needs: a wrong key and a tampered payload are the same
   * failure, and neither should reach AES.
   */
  function decrypt(envelope, keyHex) {
    var s = requireSubtle();
    if (typeof envelope !== "string" || envelope.length <= MAC_HEX + IV_HEX) {
      return Promise.reject(new Error("Malformed payload: too short to be an envelope."));
    }
    var mac = envelope.slice(0, MAC_HEX);
    var body = envelope.slice(MAC_HEX);

    return sign(body, keyHex)
      .then(function (expected) {
        if (!hexEquals(expected, mac)) {
          var err = new Error("BAD_PASSWORD");
          err.code = "BAD_PASSWORD";
          throw err;
        }
        return s.importKey("raw", fromHex(keyHex), ALGO, false, ["decrypt"]);
      })
      .then(function (key) {
        return s.decrypt({ name: ALGO, iv: fromHex(body.slice(0, IV_HEX)) }, key, fromHex(body.slice(IV_HEX)));
      })
      .then(function (out) {
        return new TextDecoder().decode(new Uint8Array(out));
      });
  }

  /** Plain SHA-256, used for the change-detection fingerprint. Not secret. */
  function sha256Hex(str) {
    return requireSubtle()
      .digest("SHA-256", utf8(str))
      .then(function (buf) {
        return toHex(new Uint8Array(buf));
      });
  }

  return {
    deriveKey: deriveKey,
    encrypt: encrypt,
    decrypt: decrypt,
    sha256Hex: sha256Hex,
    toHex: toHex,
    fromHex: fromHex,
  };
});
