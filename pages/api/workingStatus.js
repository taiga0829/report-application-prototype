import { google } from 'googleapis';
import { createLogSheet, createSummarySheet } from './createSheet';
import { getLogSheetName, getSummarySheetName } from './Utils';


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

    if (messageAttribute !== null) {
      const logSheetName = getLogSheetName();

      const sheetsList = await googleSheets.spreadsheets.get({
        spreadsheetId,
      });
      const logSheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === logSheetName);
      if (logSheetExists) {
        let range = `${logSheetName}!A:B`;
        const result = googleSheets.spreadsheets.values.append({
          auth,
          spreadsheetId,
          range: range,
          valueInputOption: 'RAW',
          resource: {
            values: [
              [new Date().toISOString(), messageAttribute],
            ],
          },
        });
        const data = new Date().toISOString()
        res.status(200).json({ message: 'Successfully submitted! Thank you!' });
      }
    } else {
      const spreadsheetId = process.env.SPREADSHEET_ID;
      const logSheetName = getLogSheetName();
      await createLogSheet(logSheetName);
    }
    console.error('Specific Error:', error);
    res.status(400).json({ message: 'Invalid range specified' });

  } else if (req.method === 'GET') {
    // Handle the GET request to retrieve data from the spreadsheet
    const logSheetName = getLogSheetName();
    let range = `${logSheetName}!A:C`; // Modify the range as needed
    const sheetsList = await googleSheets.spreadsheets.get({
      spreadsheetId,
    });
    //console.log(sheetsList);
    const logSheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === logSheetName);
    if (logSheetExists) {
      try {
        // Use spreadsheets.get to retrieve spreadsheet data
        const response = await googleSheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range: range,
        });
        const res_values = response.data.values;

        if (res_values && res_values.length > 0) {
          res.status(200).json({ message: 'Successfully retrieved spreadsheet data!', data: res_values });
        } else if (res_values === "undefined") {
          res.status(500).json({ message: "SpreadSheet is empty. " });
        } else {
          res.status(404).json({ message: 'No values found in the specified range.' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve spreadsheet data' });
      }
    } else {
      // Make an API request to the server-side endpoint to create a new sheet;
      // send user status to new sheet
      const logSheetName = getLogSheetName();
      let range = `${logSheetName}!A:B`; // Modify the range as needed
      console.log("eev");
      await createLogSheet(logSheetName);
      console.log("evebeve");
    }
  } else {
    console.log("cscscvw");
    res.status(405).end(); // Method Not Allowed
  }
}




