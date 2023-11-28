import { google } from 'googleapis';
import { createLogSheet, createSummarySheet, addFormulaAndString } from './createSheet';
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
      const currentStatus = await getCurrentStatus();
      // if user status is "start", cannot log "standby"
      if (!(currentStatus === "start" && messageAttribute === "standby")) {
        const logSheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === logSheetName);
        if (logSheetExists) {
          const logSheetName = getLogSheetName();
          // Accessing individual sheets
          sheets.forEach((sheet, index) => {
            const sheetTitle = sheet.properties.title;
            if (logSheetExists) {
              sheetId = sheet.properties.sheetId;
            }
            console.log(`Sheet ${index + 1} - Title: ${sheetTitle}, Sheet ID: ${sheetId}`);
            console.log("a");
          });
          console.log("logSheetExists");
          console.log(sheetId);
          console.log("=======");
          await addFormulaAndString(logSheetName, sheetId);
          console.log("evebeve");
          let range = `${logSheetName}!A:B`;
          const result = await googleSheets.spreadsheets.values.append({
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

        const summarySheetName = getSummarySheetName();
        createSummarySheet(summarySheetName);
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

    const sheets = sheetsList.data.sheets;
    let sheetId = 0;
    let logSheetExists;
    // Accessing individual sheets
    sheets.forEach((sheet, index) => {
      const sheetTitle = sheet.properties.title;
      logSheetExists = sheet.properties.title === logSheetName;
      if (logSheetExists) {
        console.log("===");
        sheetId = sheet.properties.sheetId;
        addFormulaAndString(logSheetName, sheetId);
        console.log("===");
      }


      console.log(`Sheet ${index + 1} - Title: ${sheetTitle}, Sheet ID: ${sheetId}`);
    });
    
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

      //TODO: cannot do two operation, create log sheet and add formula 
      // try to add formula but cannot get ID of created sheet one time
      const logSheetName = getLogSheetName();
      let range = `${logSheetName}!A:B`; // Modify the range as needed

      await createLogSheet(logSheetName);
      // Accessing individual sheets
      sheets.forEach((sheet, index) => {
        const sheetTitle = sheet.properties.title;
        if (logSheetExists) {
          sheetId = sheet.properties.sheetId;
        }
        console.log(`Sheet ${index + 1} - Title: ${sheetTitle}, Sheet ID: ${sheetId}`);
      });
      console.log(logSheetExists);
      console.log(sheetId);
      console.log("=======");
      await addFormulaAndString(logSheetName, sheetId);
      console.log("evebeve");
    }
  } else {
    console.log("cscscvw");
    res.status(405).end(); // Method Not Allowed
  }
}

export async function getCurrentStatus() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
  const spreadsheetId = process.env.SPREADSHEET_ID;
  // Handle the GET request to retrieve data from the spreadsheet
  const logSheetName = getLogSheetName();
  let range = `${logSheetName}!A:C`; // Modify the range as needed
  const response = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: range,
  });

  const userData = response.data.data; // Assuming your data is in the 'data' property

  if (userData.length > 0) {
    const userCurrentStatus = userData[userData.length - 1][1];
    console.log(userCurrentStatus);
    return userCurrentStatus;
  } else {
    // Handle the case where the array is empty
    return null; // or any other appropriate value
  }
}


