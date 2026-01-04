# Netlify & Google Sheets Setup (Quick Guide)

Follow these steps to enable automatic storage of form submissions into a Google Sheet and to keep the email notifications working:

1. Create a Google Service Account
   - In Google Cloud Console, create a project and enable the **Google Sheets API**.
   - Create a **Service Account** and generate a JSON key. Save the JSON content.

2. Prepare a Google Sheet
   - Create a spreadsheet in Google Sheets.
   - Add two sheets (tabs) named exactly: `Students` and `Faculty`.
   - Share the spreadsheet with the service account email (the `client_email` from the JSON) with Editor access.

3. Add Netlify Environment Variables
   - Go to your site settings on Netlify → Build & deploy → Environment → Environment variables
   - Add the following variables:
     - `GOOGLE_SERVICE_ACCOUNT` = _the entire JSON key as a single-line string_ (escape newlines or paste as an env var value)
     - `SHEET_ID` = _the Google Spreadsheet ID (from its URL)_
     - `ADMIN_EMAIL` = _where admin notifications should go_
     - `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST` (optional), `SMTP_PORT` (optional) — for sending emails via SMTP

   Tip: For `GOOGLE_SERVICE_ACCOUNT`, copy the JSON and paste it into Netlify's UI as a single value. If you prefer, store the JSON in a secret manager and reference it.

4. Install dependencies locally (for functions to use `googleapis`):
   - Run: `npm install` (this will install `googleapis` and `nodemailer`)

5. Deploy to Netlify
   - Push your changes to your repository and Netlify will run a deploy.
   - Form submissions will be captured by Netlify Forms and also appended to the Google Sheet by the serverless functions.

6. Testing
   - Submit the student and faculty forms from the site.
   - Confirm: an email should arrive to the applicant/parent, a form entry should appear in the Netlify Forms dashboard, and a new row should be appended to your Google Sheet under the correct tab.

Security note: Keep the `GOOGLE_SERVICE_ACCOUNT` and SMTP credentials secret. Do not commit private keys into the repository.
