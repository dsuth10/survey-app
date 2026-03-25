# Hosting the survey app on a school LAN

Use this when students on other computers need a **stable URL** to the host PC.

## Recommended: one URL (production)

The UI and API are served together on **one port** (default **3006**). Students only bookmark `http://<host-IPv4>:3006`.

1. From the **repository root** (folder that contains `frontend` and `backend`):

   ```bash
   npm run serve:lan
   ```

   This builds the React app, then starts the backend with `NODE_ENV=production` and prints shareable `http://…` lines.

2. Or manually:

   ```bash
   npm run build --prefix frontend
   npm run start:lan --prefix backend
   ```

3. After you change frontend code, run `serve:lan` again (or rebuild + `start:lan`) so students get the new UI.

**Environment (optional):** create `backend/.env` if you need a custom port or session secret:

- `PORT` — listen port (default `3006`)
- `SESSION_SECRET` — long random string (recommended for shared hosts)
- `USE_HTTPS=true` — only if you terminate TLS in front of the app; leave unset for plain `http://` on the LAN

## Development: two processes (Vite + API)

If you use `npm run dev` from the repo root, Vite is configured with **`host: true`** so the dev UI is reachable at:

`http://<host-IPv4>:3005`

The backend must still be running on **3006** on the same PC (the dev server proxies `/api` to `localhost:3006`).

## Host checklist (Windows)

1. **Correct address** — On the host, run `ipconfig` and use the **IPv4** address of the active Wi‑Fi or Ethernet adapter (often `192.168.x.x` or `10.x.x.x`). Students must **not** use `localhost` on their own machines; that refers to their PC, not yours.

2. **Windows Firewall** — Allow **inbound** TCP on the port you use:
   - Production: typically **3006** (or your `PORT`)
   - Dev-only: **3005** (Vite) and **3006** (API)

   In *Windows Defender Firewall → Advanced settings → Inbound Rules*, create a rule for the chosen port(s) on the **Private** profile (typical for trusted school/classroom networks).

3. **Same network** — Host and students must be on a network segment where devices can talk to each other.

4. **If nothing connects** — Many school Wi‑Fi networks use **client / AP isolation** (wireless clients cannot reach each other). That cannot be fixed in app code. Ask IT for a VLAN or SSID without isolation, use wired Ethernet on the same subnet, or use an approved tunnel/service if external access is allowed.

## Quick reference

| Mode            | Student URL                 | Firewall (typical) |
|----------------|-----------------------------|--------------------|
| Production     | `http://<host-ip>:3006`     | TCP 3006           |
| Dev (Vite)     | `http://<host-ip>:3005`     | TCP 3005 and 3006  |
