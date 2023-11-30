import { google } from 'googleapis';
import { getLogSheetName } from './Utils';


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
}

//if summary sheet exists, return null
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

    const summarySheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === summarySheetName);

    if (summarySheetExists) {
        return null;
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

