# VPS deployment checklist (survey app)

Short list for hosting this repo on a Linux VPS. The app is **Express + SQLite + React (Vite build)**; production serves the UI from `frontend/dist` on one port (see [LAN-HOSTING.md](LAN-HOSTING.md) for how that works).

## Server prep

- [ ] **Node.js** — LTS version installed (matches your dev machine if possible).
- [ ] **Clone & install** — `git clone` this repo, checkout branch `vps`, run `npm run install:all` from the repo root (or `npm install` in `frontend/` and `backend/`).

## Configuration

- [ ] **`backend/.env`** — Copy from `backend/.env.example`. Set:
  - `NODE_ENV=production`
  - `PORT` — e.g. `3006` (or whatever your process listens on behind the proxy)
  - `SESSION_SECRET` — long random string (required for real use)
  - If HTTPS is terminated at a reverse proxy, set `USE_HTTPS=true` (see `.env.example`).
- [ ] **`survey.db`** — Lives beside the app (see backend DB path). Plan **backups** and restore tests.

## Build & run

- [ ] **Build frontend** — From repo root: `npm run build --prefix frontend` (or use `npm run serve:lan` / `npm run classroom` patterns that build then start).
- [ ] **Start backend** — `npm start --prefix backend` (or root `npm start`). Confirm the app loads in a browser on `http://<server-ip>:<PORT>/`.

## Production hardening

- [ ] **Process manager** — Use **systemd**, **PM2**, or similar so Node restarts on crash and on reboot.
- [ ] **Reverse proxy** — **Nginx** or **Caddy** in front: TLS, HTTP/2, gzip; proxy to `127.0.0.1:<PORT>`. Do not expose Node directly on the public internet if you can avoid it.
- [ ] **HTTPS** — Certificate (Let’s Encrypt or your provider); set cookie/session options appropriately with `USE_HTTPS` if required.
- [ ] **Firewall** — Allow **22** (SSH), **80/443** (web); block direct public access to the Node port unless intentional.

## Ops

- [ ] **Deploy updates** — Pull `vps` branch, `npm run install:all` if deps changed, rebuild frontend, restart process.
- [ ] **Monitoring** — Disk space (SQLite grows), logs, and failed restarts.

For LAN-only classroom hosting from one machine, use [LAN-HOSTING.md](LAN-HOSTING.md) instead.
