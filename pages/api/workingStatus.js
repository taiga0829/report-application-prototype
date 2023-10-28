import { google } from 'googleapis';

export default async function handler(req, res) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = process.env.SPREADSHEET_ID;

  if (req.method === 'POST') {
    // Handle the POST request to write data to the spreadsheet
    const { request, name } = req.body;
    const messageAttribute = req.body.message;
    console.log(messageAttribute);
    try {
      // Write row(s) to the spreadsheet
      const result = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'A1:C3', // Modify the range as needed
        valueInputOption: 'RAW',
        resource: {
          values: [
            [new Date().toISOString(), messageAttribute],
          ],
        },
      });
      const data = new Date().toISOString()
      console.log(data);

      res.status(200).json({ message: 'Successfully submitted! Thank you!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to submit data' });
    }
  } else if (req.method === 'GET') {
    // Handle the GET request to retrieve data from the spreadsheet
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = currentDateTime.getMonth() + 1; // Months are 0-indexed, so add 1
    const sheetName = `log ${year}/${month}`;
    let range = `${sheetName}!A:C`; // Modify the range as needed

    try {
      // Use spreadsheets.get to retrieve spreadsheet data
      const response = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: range,
      });

      const values = response.data.values;
      console.log(values);
      if (values && values.length > 0) {
        res.status(200).json({ message: 'Successfully retrieved spreadsheet data!', data: values });
      } else if (values === "undefined") {
        res.status(500).json({ message: "SpreadSheet is empty. " });
      } else {
        res.status(404).json({ message: 'No values found in the specified range.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve spreadsheet data' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

