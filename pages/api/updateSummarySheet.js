// import { google } from 'googleapis';
// import { DateTime } from 'luxon'; // Luxon is a library for handling dates and times

// const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // Replace with your actual spreadsheet ID

// export async function updateSummarySheet(date, timeGap) {
//     const auth = new google.auth.GoogleAuth({
//         keyFile: 'credentials.json',
//         scopes: 'https://www.googleapis.com/auth/spreadsheets',
//     });

//     // Create a client instance for auth
//     const client = await auth.getClient();

//     // Instance of Google Sheets API
//     const googleSheets = google.sheets({ version: 'v4', auth: client });

//     // Define the range and values to update in the summary sheet
//     const range = `summary ${date}`;
//     const values = [[date, 'Working hours', timeGap]];

//     // Use the spreadsheets.values.update method to update the summary sheet
//     const response = await googleSheets.spreadsheets.values.update({
//         spreadsheetId: SPREADSHEET_ID,
//         range,
//         valueInputOption: 'RAW',
//         resource: { values },
//     });

//     // Log the response or handle any errors
//     console.log('Summary sheet updated:', response.data);
// }

// // Call the function to update the summary sheet
// const timestamp1 = '2023-10-28T15:39:16.067Z';
// const timestamp2 = '2023-10-28T15:49:18.616Z';

// const date1 = DateTime.fromISO(timestamp1);
// const date2 = DateTime.fromISO(timestamp2);

// const timeDifference = date2.diff(date1, ['milliseconds']).milliseconds;

// const formattedDate = date1.toFormat('MM/dd'); // Format as "10/28"

// updateSummarySheet(formattedDate, timeDifference);
