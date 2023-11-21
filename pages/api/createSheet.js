import { google } from 'googleapis';

export async function createLogSheet(logSheetName) {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    // Create a client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Check if the log sheet already exists
    const sheetsList = await googleSheets.spreadsheets.get({
        spreadsheetId,
    });

    //TODO: add validation make sure that file exsists if app try to do some operation for files
    const logSheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === logSheetName);

    if (logSheetExists) {
        res.status(400).json({ message: `Sheet "${logSheetName}" already exists.` });
    } else {
        const logSheetRequest = {
            properties: {
                title: logSheetName,
            },
        };

        const requests = [
            {
                addSheet: logSheetRequest,
            },
            {
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 0, // Row index for C1
                        columnIndex: 2, // Column index for C1
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=ARRAYFORMULA(A1:A)',
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
            {
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 0, // Row index for F1
                        columnIndex: 5, // Column index for F1
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=COUNTIF(B1:B, E1)',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 1, // Row index for F2
                        columnIndex: 5, // Column index for F2
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=COUNTIF(B2:B, E2)',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 3, // Row index for F4
                        columnIndex: 5, // Column index for F4
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=INDEX(QUERY(A1:C, "select sum(Col3) where Col2=\'start\'", 0), 2, 1)',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 4, // Row index for F5
                        columnIndex: 5, // Column index for F5
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=INDEX(QUERY(A2:C, "select sum(Col3) WHERE Col2=\'stop\'"), 2,1)',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 6, // Row index for F5
                        columnIndex: 5, // Column index for F5
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=EXACT(B1, "stop")',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 7, // Row index for F8
                        columnIndex: 5, // Column index for F8
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=NOT(EXACT(INDEX(B:B, COUNTA(B:B)), "stop"))',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 10, // Row index for F11
                        columnIndex: 5, // Column index for F11
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=L16',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 11, // Row index for F12
                        columnIndex: 5, // Column index for F12
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=L16+1',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 0, // Row index for I1
                        columnIndex: 8, // Column index for I1
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=F5-F4 + IF(F8, F12, 0) - IF(F7, F11, 0)',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                    fields: '*',
                    start: {
                        sheetId: spreadsheetId,
                        rowIndex: 0, // Row index for I1
                        columnIndex: 8, // Column index for I1
                    },
                    rows: [
                        {
                            values: [
                                {
                                    userEnteredValue: {
                                        formulaValue: '=IF(I1>=L12, L12, I1)',
                                    },
                                },
                            ],
                        },
                    ],
                },
                updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 11, // Row index for L12
                            columnIndex: 11, // Column index for L12
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: '06:00:00.000',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 15, // Row index for L12
                            columnIndex: 11, // Column index for L12
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: '2023/12/30',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 0, // Row index for E1
                            columnIndex: 3, // Column index for E1
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'start',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 1, // Row index for E2
                            columnIndex: 3, // Column index for E2
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'stop',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 3, // Row index for E4
                            columnIndex: 3, // Column index for E4
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Total start time',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 4, // Row index for E4
                            columnIndex: 3, // Column index for E4
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Total stop time',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 6, // Row index for E4
                            columnIndex: 3, // Column index for E4
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Starting with "stop"',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 7, // Row index for E4
                            columnIndex: 3, // Column index for E4
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'No starting with "stop"',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 10, // Row index for E4
                            columnIndex: 3, // Column index for E4
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'assuming START',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 11, // Row index for E4
                            columnIndex: 3, // Column index for E4
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'assuming STOP',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 0, // Row index for E4
                            columnIndex: 7, // Column index for E4
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'working hours',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 0, // Row index for E4
                            columnIndex: 7, // Column index for E4
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'working hours',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    updateCells: {
                        fields: '*',
                        start: {
                            sheetId: spreadsheetId,
                            rowIndex: 1, // Row index for E4
                            columnIndex: 7, // Column index for E4
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: 'Report working hours',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    
                
            },
        ];
        
        const batchUpdateRequest = {
            spreadsheetId,
            resource: {
                requests,
            },
        };

        const response = await googleSheets.spreadsheets.batchUpdate(batchUpdateRequest);
        return response;
    }
}

export async function createSummarySheet(summarySheetName) {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    // Create a client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Check if the log sheet already exists
    const sheetsList = await googleSheets.spreadsheets.get({
        spreadsheetId,
    });

    //TODO: add validation make sure that file exsists if app try to do some operation for files
    const logSheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === summarySheetName);

    if (logSheetExists) {
        res.status(400).json({ message: `Sheet "${summarySheetName}" already exists.` });
    } else {
        const summarySheetRequest = {
            properties: {
                title: summarySheetName,
            },
        };
        const requests = [
            {
                addSheet: summarySheetRequest,
            },
            //TODO: each updateCells, one equation is added. strings are added with append
        ];
        
        const batchUpdateRequest = {
            spreadsheetId,
            resource: {
                requests,
            },
        };
        
        const response = await googleSheets.spreadsheets.batchUpdate(batchUpdateRequest);
        const result = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: range,
            valueInputOption: 'RAW',
            resource: {
              values: [
                [new Date().toISOString(), "not standby"],
              ],
            },
          });
        return response;
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        //POST:Create summary sheet GET:Create log Sheet 
        try {
            createSummarySheet();
            res.status(200).json({ message: 'Summary sheet was created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create sheets' });
        }
    }else if(req.method == "GET"){
        try {
            createLogSheet();
            res.status(200).json({ message: 'Log sheet was created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create sheets' });
        }
    }
}

