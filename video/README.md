# VSL video

`/scan/` plays `video/vsl.mp4` from this domain. Nothing on the page depends on
YouTube any more, so no visitor is ever asked to sign in or prove they are not a bot.

Until `vsl.mp4` lands here, the page silently falls back to the YouTube embed
(`dvFuz6aPVig`) so the lander is never dead. Drop the file in and the fallback stops
being used.

## Dropping the file in

Source: the Riverside take 04 master ("Local Growth Partner - Intro", 7:29).

Encode it for the web first. Straight-off-the-camera masters are 1-3 GB and will not
serve. Target 60-80 MB:

```
ffmpeg -i "riverside-take-04.mp4" \
  -vf "scale=-2:720" \
  -c:v libx264 -preset slow -crf 26 -maxrate 1400k -bufsize 2800k \
  -pix_fmt yuv420p -profile:v high -level 4.0 \
  -c:a aac -b:a 96k -ac 2 \
  -movflags +faststart \
  vsl.mp4
```

- `-movflags +faststart` is not optional. Without it the whole file downloads before
  the first frame shows.
- `-crf 26` at 720p is the size/quality knob. Lower = better and bigger.
- Check the result: `ls -lh vsl.mp4` should read well under 100 MB (GitHub's hard
  per-file limit), and it should start playing within a second or two.

Then commit it and push.

## Host

GitHub Pages serves this today. It supports range requests, so seeking works, but it
is not a video CDN: the soft ceiling is 100 GB/month, which is roughly 1,500 complete
views of a 70 MB file. That is fine at current spend and is not fine at scale.

When it needs to move, put the file on Cloudflare R2 / Stream or Bunny and change one
line in `scan/index.html`:

```js
var VSL_SRC = '/video/vsl.mp4';   // -> 'https://cdn.example.com/vsl.mp4'
```

The player, the fallback and the tracking all follow that constant.
