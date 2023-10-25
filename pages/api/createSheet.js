import { google } from 'googleapis'; // Import the googleapis library

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

            //add formula dynamically 

            // const request = {
            //     spreadsheetId,
            //     resource: {
            //         requests: [
            //             {
            //                 updateCells: {
            //                     range: {
            //                         sheetId: 0,
            //                         startRowIndex: 0,
            //                         endRowIndex: 1,
            //                         startColumnIndex: 0,
            //                         endColumnIndex: 1,
            //                     },
            //                     rows: [
            //                         {
            //                             values: [
            //                                 {
            //                                     userEnteredValue: {
            //                                         formulaValue: '=SUM(B2:B6)', // The function you want to add
            //                                     },
            //                                 },
            //                             ],
            //                         },
            //                     ],
            //                     fields: 'userEnteredValue.formulaValue',
            //                 },
            //             },
            //         ],
            //     },
            // };

            const response = await googleSheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: {
                    requests: [
                        {
                            addSheet: {
                                properties: {
                                    title: 'taiga',
                                },
                            },
                        },
                    ],
                },
            });

            res.status(200).json({ message: 'New sheet created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create a new sheet' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}

