#!/usr/bin/env node
/**
 * Encrypts the call cockpit (payment links, working links, call script) into
 * dash/cockpit.enc.json.
 *
 * The cockpit is proprietary sales material, so its plaintext must never be
 * committed — this repo is public. Keep the source JSON outside the repo (a
 * password manager, a private note, your machine), run this to publish it, and
 * commit only the encrypted output.
 *
 * Unlike data.enc.json this is not on a schedule: the cockpit changes when you
 * decide it does, not when an API does.
 *
 *   DASH_PASSWORD='…' node scripts/encrypt-cockpit.mjs path/to/cockpit.json
 *
 * The source JSON is { links: [{label, url, kind}], callScript: "markdown" }.
 */

import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LGPCrypto = require(join(ROOT, "dash/assets/lgp-crypto.js"));

const OUT_FILE = join(ROOT, "dash/cockpit.enc.json");

/** Must match SALT in refresh-dashboard.mjs and dash/index.html. */
const SALT = "c01b7c6c55b689e1ac19fb22b1bf8b9c";

const source = process.argv[2];
const password = process.env.DASH_PASSWORD;

if (!source || !password) {
  console.error("Usage: DASH_PASSWORD='…' node scripts/encrypt-cockpit.mjs <cockpit.json>");
  process.exit(1);
}

const raw = await readFile(source, "utf8");
const cockpit = JSON.parse(raw);

if (!Array.isArray(cockpit.links)) {
  console.error("Source must contain a `links` array.");
  process.exit(1);
}

const key = await LGPCrypto.deriveKey(password, SALT);
const plaintext = JSON.stringify(cockpit);
const fingerprint = await LGPCrypto.sha256Hex(plaintext);
const payload = await LGPCrypto.encrypt(plaintext, key);

await writeFile(
  OUT_FILE,
  JSON.stringify({ v: 1, alg: "aes-256-cbc+hmac-sha256", salt: SALT, fingerprint, payload }, null, 0) + "\n"
);

console.log(
  `Wrote ${OUT_FILE} — ${cockpit.links.length} links, ` +
    `${(cockpit.callScript || "").length} chars of script, fingerprint ${fingerprint.slice(0, 12)}.`
);
