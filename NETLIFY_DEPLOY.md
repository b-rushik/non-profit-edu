# Netlify Deployment Guide ✅

This project uses Netlify Forms to collect student registrations, volunteer registrations, and contact messages. The frontend is a standard React app (Create React App). Follow these steps to deploy the site and enable native form submissions:

1) Connect repository
- Go to https://app.netlify.com and create a new site from Git.
- Connect your Git provider and choose this repository.

2) Build settings
- Base directory: `frontend`
- Build command: `yarn build` or `npm run build`
- Publish directory: `frontend/build`

Note: `netlify.toml` is already provided with the proper `base` and `publish` settings.

3) Environment variables (optional)
- The app does not require special env vars to use Netlify forms in production.
- If you still use the backend API for limits or admin, set `REACT_APP_BACKEND_URL` to your API URL.
- The backend can still be used locally if you set `USE_EXCEL=true` there (local only).

4) Netlify Forms: how it works
- Hidden static forms are included in `frontend/public/index.html` so Netlify detects them at build time.
- The React forms submit from the browser using `application/x-www-form-urlencoded` (see `submitToNetlify` in `frontend/src/lib/utils.js`).
- Submissions appear in Netlify Dashboard → Forms for the site.
- **Webhook security (optional):** The backend supports an optional `NETLIFY_WEBHOOK_SECRET`. If set, configure Netlify to send header `X-Webhook-Token` with that value. If left unset, the backend will accept webhooks without token verification (useful for quick setups; not recommended for public deployments).

5) Test submissions
- After deployment, visit the site and submit each form (student, volunteer, contact).
- On success you'll be redirected to `/thank-you`.
- Check your site’s Netlify Dashboard → Forms to see submissions.

6) Configure Netlify to forward submissions to your backend (webhook)
- In the Netlify UI: go to Site → Forms → Notifications → Add notification → choose "Outgoing webhook".
  1. Set the URL to: `https://<YOUR_BACKEND_HOST>/api/netlify/webhook` (replace with your backend hostname — must be publicly reachable from Netlify).
  2. Set Method to `POST` and Content Type to `application/json`.
  3. Optionally add a Header `X-Webhook-Token` with the value of your backend secret if you want verification.
  4. Save the notification.

7) Set environment variables in Netlify Console (for frontend builds and webhook secret)
- In the Netlify UI: go to Site → Site settings → Build & deploy → Environment → Edit variables.
  1. Add `REACT_APP_BACKEND_URL` with the value of your backend's base URL (e.g. `https://api.example.org`). This ensures the frontend forwards submissions and fetches counts from your backend.
  2. (Optional, for webhook security) Add `NETLIFY_WEBHOOK_SECRET` with a strong secret value. If you set this, also add the same header `X-Webhook-Token` in the outgoing webhook configuration above.
  3. Save changes.

Notes:
- If your backend runs on `localhost` for local development, Netlify cannot call it. Deploy the backend (or use a tunnel like ngrok) for production/webhook testing.
- You can also set `REACT_APP_API_URL` in `netlify.toml` or as a Netlify environment variable; the app uses `REACT_APP_BACKEND_URL` first if present.
- For quick setups you can leave `NETLIFY_WEBHOOK_SECRET` unset — the backend will accept webhooks without verification, but this is less secure.

8) Quick commands to verify things
- Test webhook manually with the script added to this repo:
  - `python scripts/test_netlify_webhook.py http://127.0.0.1:8000` (no token)
  - `python scripts/test_netlify_webhook.py https://your-backend mysecret student-registration` (with token)
- Check counts endpoint directly:
  - `curl https://<YOUR_BACKEND_HOST>/api/registrations/count`

9) Admin and local dev notes
- The backend is still present for local development. Excel writing is disabled by default in production flows.
- To enable Excel writing locally: set `USE_EXCEL=true` in `backend/.env` and install Excel libs if necessary.

10) Summary (quick checklist)
- [ ] Connect repo in Netlify
- [ ] Set build settings (see step 2)
- [ ] Deploy and test forms
- [ ] Configure outgoing webhook to `https://<YOUR_BACKEND>/api/netlify/webhook`
- [ ] Set `REACT_APP_BACKEND_URL` and (optionally) `NETLIFY_WEBHOOK_SECRET` in Netlify environment variables

If you'd like, I can prepare an optional Netlify Function to forward submissions to email or to integrate with Google Sheets/Slack. Let me know if you want that next. ✨