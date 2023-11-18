import { google } from 'googleapis';
import { DateTime } from 'luxon';
import { createCurrentDateSheet } from './createSheet';


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
  const currentDateTime = new Date();
  const year = currentDateTime.getFullYear();
  const month = currentDateTime.getMonth() + 1; // Months are 0-indexed, so add 1
  const day = currentDateTime.getDate();
  const sheetName = `log_${year}/${month}/${day}`;
        const sheetsList = await googleSheets.spreadsheets.get({
          spreadsheetId,
      });

        const logSheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === sheetName);
        if (logSheetExists) {
          let range = `${sheetName}!A:B`; // Modify the range as needed
          //TODO: util file for chore function 
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
      } else {
          console.log("inside else");
          const auth = new google.auth.GoogleAuth({
            keyFile: 'credentials.json',
            scopes: 'https://www.googleapis.com/auth/spreadsheets',
          });
          // Create client instance for auth
          const client = await auth.getClient();

          // Instance of Google Sheets API
          const googleSheets = google.sheets({ version: 'v4', auth: client });

          const spreadsheetId = process.env.SPREADSHEET_ID;
          // Make an API request to the server-side endpoint to create a new sheet;
          // send user status to new sheet
          const currentDateTime = new Date();
          const year = currentDateTime.getFullYear();
          const month = currentDateTime.getMonth() + 1; 
          const day = currentDateTime.getDate();// Months are 0-indexed, so add 1
          const sheetName = `log_${year}/${month}/${day}`;
          const sufix = `${year}/${month}/${day}? `
          let range = `${sheetName}!A:B`; // Modify the range as needed
          createCurrentDateSheet(sufix)
        }
        console.error('Specific Error:', error);
        res.status(400).json({ message: 'Invalid range specified' });

      }else if (req.method === 'GET') {
      // Handle the GET request to retrieve data from the spreadsheet
      const currentDateTime = new Date();
      const year = currentDateTime.getFullYear();
      const month = currentDateTime.getMonth() + 1; // Months are 0-indexed, so add 1
      const sheetName = `log_${year}/${month}`;
      let range = `${sheetName}!A:C`; // Modify the range as needed
      const sheetsList = await googleSheets.spreadsheets.get({
        spreadsheetId,
    });
      const logSheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === sheetName);
      if (logSheetExists) {
        try {
          // Use spreadsheets.get to retrieve spreadsheet data
          const response = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: range,
          });
          const res_values = response.data.values;
  
          if (res_values) {
            const userStatus = res_values[res_values.length - 1][1];
            // index should 3 <= x since status should have stages to reach "stop" (local change => start => stop)
            if (userStatus === "stop") {
              // get current working hours from summary sheet
              const currentDateTime = new Date();
              const year = currentDateTime.getFullYear();
              const month = currentDateTime.getMonth() + 1; // Months are 0-indexed, so add 1
              const day = currentDateTime.getDate();
  
              const sheetName = `log_${year}/${month}/${day}`;
              let range = `${sheetName}!A${day}:C${day}`; // Modify the range as needed
              const response = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: range,
              });
              console.log("************"); 
              if (response && response.data.length > 0) {
                console.log("==================="); 
                const prevWorkingahoursSameDay = response.data.values[0][1];
                const [hoursToAdd, minutesToAdd] = prevWorkingahoursSameDay.split(':').map(Number);
                const timeInMillisecondsToAdd = (hoursToAdd * 60 + minutesToAdd) * 60 * 1000;
                //'2023-10-29T10:45:31.538Z'
                const stopTime = res_values[res_values.length - 1][0];
                console.log(stopTime);
                const startTime = res_values[res_values.length - 2][0];
                // Parse the timestamps into Date objects
                const date1 = new Date(stopTime);
                const date2 = new Date(startTime);
                // Calculate the time difference in milliseconds
                const timeDifference = Math.abs(date2 - date1);
                const newTimeDifference = timeDifference + timeInMillisecondsToAdd;
                // Convert the time difference to seconds
                const secondsDifference = newTimeDifference / 1000;
                // Calculate hours and minutes
                const hours = Math.floor(secondsDifference / 3600);
                const remainingSeconds = secondsDifference % 3600;
                const minutes = Math.floor(remainingSeconds / 60);
                console.log(`Time difference: ${hours} hours and ${minutes} minutes`);
                // Parse the timestamps into DateTime objects
                const stopDate = DateTime.fromISO(stopTime, { zone: 'utc' });
                // Format the dates as "mm/dd"
                const formattedStopDate = stopDate.toFormat('MM/dd');
                console.log(formattedStopDate);
                // Write row(s) to the spreadsheet
                const formattedWorkingHours = `${hours}:${minutes}`;
  
                const result = await googleSheets.spreadsheets.values.update({
                  auth,
                  spreadsheetId,
                  range: range,
                  valueInputOption: 'RAW',
                  resource: {
                    values: [
                      [formattedStopDate, formattedWorkingHours],
                    ],
                  },
                });
  
              }
            }
          }
  
          if (res_values && res_values.length > 0) {
            res.status(200).json({ message: 'Successfully retrieved spreadsheet data!', data: res_values });
          } else if (res_values === "undefined") {
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
      }else{
        console.log("inside else");
        const auth = new google.auth.GoogleAuth({
          keyFile: 'credentials.json',
          scopes: 'https://www.googleapis.com/auth/spreadsheets',
        });
        // Create client instance for auth
        const client = await auth.getClient();

        // Instance of Google Sheets API
        const googleSheets = google.sheets({ version: 'v4', auth: client });

        const spreadsheetId = process.env.SPREADSHEET_ID;
        // Make an API request to the server-side endpoint to create a new sheet;
        // send user status to new sheet
        const currentDateTime = new Date();
        const year = currentDateTime.getFullYear();
        const month = currentDateTime.getMonth() + 1; // Months are 0-indexed, so add 1
        const day = currentDateTime.getDate();
        const sheetName = `log_${year}/${month}/${day}`;
        const sufix = `${year}/${month}`
        let range = `${sheetName}!A:B`; // Modify the range as needed
        createCurrentDateSheet(sufix)
      }
    

  }




