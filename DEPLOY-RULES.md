# Deploy rules for this repo (read before pushing)
- This repo IS the source of truth for the site. Two writers exist: a design session (commits here directly) and the maps-agency tooling on Ben's Mac (maps-agency/website/deploy.sh).
- deploy.sh only ever publishes the paths it is given (default: dash/). It never copies the whole site folder. It refreshes the local folder from this repo first.
- If you are the design session: pull before you work, keep every functional piece in place (Places gate, consent text, closer routing, VSL tracking, thanks 3 steps, pixel, Clarity, Cal embed), and never revert content wording (guarantee, pricing, $500 setup) without Ben's word.
- dash/ and dash/r/ are generated, encrypted files. Never hand-edit them.
