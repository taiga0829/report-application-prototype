import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const auth = new google.auth.GoogleAuth({
                keyFile: 'credentials.json',
                scopes: 'https://www.googleapis.com/auth/spreadsheets',
            });

            // Create a client instance for auth
            const client = await auth.getClient();

            // Instance of Google Sheets API
            const googleSheets = google.sheets({ version: 'v4', auth: client });

            const spreadsheetId = process.env.SPREADSHEET_ID;

            // Generate sheet names based on the current time
            const currentDateTime = new Date();
            const year = currentDateTime.getFullYear();
            const month = currentDateTime.getMonth() + 1; // Months are 0-indexed, so add 1

            const logSheetName = `log ${year}/${month}`;
            const summarySheetName = `summary ${year}/${month}`;

            // Check if the log sheet already exists
            const sheetsList = await googleSheets.spreadsheets.get({
                spreadsheetId,
            });

            const logSheetExists = sheetsList.data.sheets.some(sheet => sheet.properties.title === logSheetName);

            if (logSheetExists) {
                res.status(400).json({ message: `Sheet "${logSheetName}" already exists.` });
            } else {
                // Create the AddSheetRequest for the log sheet
                const logSheetRequest = {
                    properties: {
                        title: logSheetName,
                    },
                };

                // Create the AddSheetRequest for the summary sheet
                const summarySheetRequest = {
                    properties: {
                        title: summarySheetName,
                    },
                };

                // Request to add both log and summary sheets
                const request = {
                    spreadsheetId,
                    resource: {
                        requests: [
                            {
                                addSheet: logSheetRequest,
                            },
                            {
                                addSheet: summarySheetRequest,
                            },
                        ],
                    },
                };

                const response = await googleSheets.spreadsheets.batchUpdate(request);

                res.status(200).json({ message: 'Log and Summary sheets created successfully' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create sheets' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
