import { google } from 'googleapis';
import { getLogSheetName } from './Utils';
export async function addFormulaAndString(logSheetName, sheetId) {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    // Create a client instance for auth
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
                            ['=ARRAYFORMULA(A1:A)', '=COUNTIF(B1:B, E1)', '=COUNTIF(B2:B, E2)', '=INDEX(QUERY(A1:C, "select sum(Col3) where Col2=\'start\'", 0), 2, 1)'],
                            ['=EXACT(B1, "stop")', '=NOT(EXACT(INDEX(B:B, COUNTA(B:B)), "stop"))', '=L16', '=L16+1', '=F5-F4 + IF(F8, F12, 0) - IF(F7, F11, 0)', 'working hours', '=IF(I1>=L12, L12, I1)'],
                            ['06:00:00.000', '2023/12/30', 'start', 'stop', 'Total start time', 'Total stop time'],
                            ['Starting with "stop"', 'assuming START', 'No starting with "stop"', 'assuming STOP', 'working hours', 'Report working hours'],
                        ],
                    },
                ],
                range: {
                    sheetId: sheetId,
                    startRowIndex: 0,
                    endRowIndex: 17, // Adjusted to cover 16 rows
                    startColumnIndex: 2,
                    endColumnIndex: 17, // Adjusted to include only one column
                }
            },
        },
    ];

    const batchUpdateRequest = {
        spreadsheetId,
        requestBody: {
            requests:requests,
        },
    };

    const response = await googleSheets.spreadsheets.batchUpdate(batchUpdateRequest);
    return response;
}

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
    const logSheetRequest = {
        properties: {
            title: logSheetName,
        },
    };

    const requests = [
        {
            addSheet: logSheetRequest,
        },
    ]
    const batchUpdateRequest = {
        spreadsheetId,
        resource: {
            requests,
        },
    };

    const response = await googleSheets.spreadsheets.batchUpdate(batchUpdateRequest);
    return response;
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
    const summarySheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === summarySheetName);

    if (summarySheetExists) {
        res.status(400).json({ message: `Sheet "${summarySheetName}" already exists.` });
    } else {
        const summarySheetName = getSummarySheetName();
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
        //TODO: no idea how to add dynamically referenced value....
        const daysInMonth = getDaysInCurrentMonth();
        for (let i = 1; i < daysInMonth + 1; i++) {

        }

        const batchUpdateRequest = {
            spreadsheetId,
            requestBody: {
                requests,
            },
        };

        const response = await googleSheets.spreadsheets.batchUpdate(batchUpdateRequest);
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
    } else if (req.method == "GET") {
        try {
            createLogSheet();
            res.status(200).json({ message: 'Log sheet was created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create sheets' });
        }
    }
}

