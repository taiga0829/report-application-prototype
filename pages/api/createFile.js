import { google } from 'googleapis';

export default async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Specify the properties of the new spreadsheet
    const spreadsheetProperties = {
        properties: {
            title: 'My New Spreadsheet', // Replace with your desired title
        },
    };

    try {
        const response = await sheets.spreadsheets.create({
            resource: spreadsheetProperties,
        });

        const spreadsheetId = response.data.spreadsheetId;
        res.status(200).json({ message: 'New spreadsheet created', spreadsheetId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create a new spreadsheet' });
    }
};