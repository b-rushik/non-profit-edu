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

5) Test submissions
- After deployment, visit the site and submit each form (student, volunteer, contact).
- On success you'll be redirected to `/thank-you`.
- Check your site’s Netlify Dashboard → Forms to see submissions.

6) Optional: Hook up notifications or mail
- Netlify Forms supports notifications, webhooks, and integrations to forward submissions to email or other tools.

7) Admin and local dev notes
- The backend is still present for local development. Excel writing is disabled by default in production flows.
- To enable Excel writing locally: set `USE_EXCEL=true` in `backend/.env` and install Excel libs if necessary.

8) Summary (quick checklist)
- [ ] Connect repo in Netlify
- [ ] Set build settings (see step 2)
- [ ] Deploy and test forms
- [ ] Inspect submissions in Netlify Dashboard → Forms

If you'd like, I can prepare an optional Netlify Function to forward submissions to email or to integrate with Google Sheets/Slack. Let me know if you want that next. ✨