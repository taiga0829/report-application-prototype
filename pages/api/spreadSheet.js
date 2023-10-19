import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { request, name } = req.body;

    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      // Write row(s) to spreadsheet
      await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'Sheet1!A:B',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[request, name]],
        },
      });

      res.status(200).json({ message: 'Successfully submitted! Thank you!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to submit data' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}




