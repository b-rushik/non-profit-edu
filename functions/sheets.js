const { google } = require('googleapis');

/**
 * Simple helper to append a row to a Google Sheet using a service account.
 * Requires the following env vars to be set in Netlify:
 * - GOOGLE_SERVICE_ACCOUNT: the JSON string of the service account key
 * - SHEET_ID: the Spreadsheet ID (set per usage in functions)
 */

async function getSheetsClient() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT environment variable');
  }

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient });
}

async function appendToSheet(spreadsheetId, range, values) {
  if (!spreadsheetId) throw new Error('Missing spreadsheetId');

  const sheets = await getSheetsClient();

  return sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [values] }
  });
}

module.exports = {
  appendToSheet
};
