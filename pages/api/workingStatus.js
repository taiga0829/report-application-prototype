import { google } from 'googleapis';
import { createLogSheet, createSummarySheet} from './createSheet';
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
  const sheetsList = await googleSheets.spreadsheets.get({
    spreadsheetId,
  });
  const sheets =sheetsList.data.sheets;

  if (req.method === 'POST') {
    // Handle the POST request to write data to the spreadsheet
    const { request, name } = req.body;
    //TODO: add validation if messageAttribute get trashy values, just ignore and return 400(BAD request)
    const messageAttribute = req.body.message;
    if (messageAttribute !== null) {
      const logSheetName = getLogSheetName();
      const currentStatus = await getCurrentStatus();
      // if user status is "start", cannot log "standby"
      let sheetId = "";
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
          });
          console.log("logSheetExists");
          console.log(sheetId);
          console.log("=======");
          await addFormulaAndString(logSheetName, sheetId,auth);
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
          
        }
        const summarySheetName = getSummarySheetName();
        await createSummarySheet(summarySheetName);
        res.status(200).json({ message: 'Successfully submitted! Thank you!' });
      }
    } else {
      const spreadsheetId = process.env.SPREADSHEET_ID;
      const logSheetName = getLogSheetName();
      try{
        await createLogSheet(logSheetName);
      }catch(error){
        console.error('Specific Error:', error);
      }
      res.status(400).json({ message: 'Invalid range specified' });
    }
    
   

  } else if (req.method === 'GET') {
    // Handle the GET request to retrieve data from the spreadsheet
    const logSheetName = getLogSheetName();
    let range = `${logSheetName}!A:C`; // Modify the range as needed


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
        addFormulaAndString(logSheetName, sheetId,auth);
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
      await addFormulaAndString(logSheetName, sheetId,auth);
      console.log("evebeve");
    }
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

  // Create client instance for auth
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });
  const response = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: range,
  });

  console.log("||||||||||||||");
  const logValues = response.data.values;
  
  console.log(logValues);
  //console.log(userData);
  if (logValues) {
    //TODO: error
    const userCurrentStatus = logValues[logValues.length - 1][1];
    console.log(userCurrentStatus);
    return userCurrentStatus;
  } else {
    // Handle the case where the array is empty
    return null; // or any other appropriate value
  }
}

export async function addFormulaAndString(logSheetName,sheetId,auth) {
  try{
      const client = await auth.getClient();
      const range = `${logSheetName}C1:G10`;
      // Instance of Google Sheets API
      const googleSheets = google.sheets({ version: 'v4', auth: client });
      const spreadsheetId = process.env.SPREADSHEET_ID;
      console.log(sheetId);
      const requests = [
        {
          updateCells: {
            fields: '*',
            rows: [
              {
                values: [
                  {
                    userEnteredValue: {
                      formulaValue: '=ARRAYFORMULA(A1:A)',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: 'start',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=COUNTIF(B1:B, E1)',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '業務時間',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=F5-F4 + IF(F8, F12, 0) - IF(F7, F11, 0)',
                    },
                  },
                  // Add more values as needed for your range
                ],
              },
              // Add another set of values for the next row
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: 'stop',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=COUNTIF(B2:B, E2)',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '報告業務時間',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=IF(I1>=L12, L12, I1)',
                    },
                  },
                  // Add more values as needed for your range
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  // Add more values as needed for your range
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: 'start時間合計',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=INDEX(QUERY(A1:C, "select sum(Col3) where Col2=\'start\'", 0), 2, 1)',
                    },
                  },
                  // Add more values as needed for your range
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: 'stop時間合計',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=INDEX(QUERY(A2:C, "select sum(Col3) WHERE Col2=\'stop\'"), 2,1)',
                    },
                  },
                  // Add more values as needed for your range
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  // Add more values as needed for your range
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: 'stopで始まっている',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=EXACT(B1, "stop")',
                    },
                  },
                  // Add more values as needed for your range
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: 'stopで終わっていない',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=NOT(EXACT(INDEX(B:B, COUNTA(B:B)), "stop"))',
                    },
                  },
                  // Add more values as needed for your range
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  }
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  }
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  }, 
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '仮想start',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=L16',
                    },
                  },
                ],
                
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  }, 
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '仮想stop',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=L16+1',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '最大業務時間',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '06:00:00.000',
                    },
                  },
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  }
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  }
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  }
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  }
                ],
              },
              {
                values: [
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  }, 
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '仮想stop',
                    },
                  },
                  {
                    userEnteredValue: {
                      formulaValue: '=L16+1',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '日付',
                    },
                  },
                  {
                    userEnteredValue: {
                      stringValue: '2023/12/30',
                    },
                  },
                ],
              },
              // Add more sets of values for additional rows
            ],
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 30,
              startColumnIndex: 2,
              endColumnIndex: 30,
            },
          },
        },
      ];
      
      const batchUpdateRequest = {
        spreadsheetId,
        requestBody: {
          requests: requests,
        },
      };
      
      const response = await googleSheets.spreadsheets.batchUpdate(batchUpdateRequest);
      return response;
      
      // const requests = [
      //     {
      //         updateCells: {
      //             fields: '*',
      //             rows: [
      //                 {
      //                     values: [
      //                         ['=ARRAYFORMULA(A1:A)', '=COUNTIF(B1:B, E1)', '=COUNTIF(B2:B, E2)', '=INDEX(QUERY(A1:C, "select sum(Col3) where Col2=\'start\'", 0), 2, 1)'],
      //                         // ['=EXACT(B1, "stop")', '=NOT(EXACT(INDEX(B:B, COUNTA(B:B)), "stop"))', '=L16', '=L16+1', '=F5-F4 + IF(F8, F12, 0) - IF(F7, F11, 0)', 'working hours', '=IF(I1>=L12, L12, I1)'],
      //                         // ['06:00:00.000', '2023/12/30', 'start', 'stop', 'Total start time', 'Total stop time'],
      //                         // ['Starting with "stop"', 'assuming START', 'No starting with "stop"', 'assuming STOP', 'working hours', 'Report working hours'],
      //                     ],
      //                 },
      //             ],
      //             range: {
      //                 sheetId: sheetId,
      //                 startRowIndex: 0,
      //                 endRowIndex: 17, // Adjusted to cover 16 rows
      //                 startColumnIndex: 2,
      //                 endColumnIndex: 17, // Adjusted to include only one column
      //             }
      //         },
      //         updateCells: {
      //           fields: '*',
      //           start: {
      //               sheetId: spreadsheetId,
      //               rowIndex: 0, // Row index for E4
      //               columnIndex: 7, // Column index for E4
      //           },
      //           rows: [
      //               {
      //                   values: [
      //                       {
      //                           userEnteredValue: {
      //                               stringValue: 'working hours',
      //                           },
      //                       },
      //                   ],
      //               },
      //           ],
      //       },
      //     },
      // ];
  
      // const batchUpdateRequest = {
      //     spreadsheetId,
      //     requestBody: {
      //         requests:requests,
      //     },
      // };
  
      // const response = await googleSheets.spreadsheets.values.batchUpdate(batchUpdateRequest);
      // return response; 

  }catch(error){
      console.error(error);
  }
}


