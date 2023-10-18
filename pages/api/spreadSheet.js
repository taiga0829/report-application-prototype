import { google } from 'googleapis';

export default function spreadSheet() {
  // Initialize the OAuth2 client
  const auth = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);

  // Use the authentication token to access the Google Sheets API
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get({
    spreadsheetId:process.env.SPREADSHEET_ID,
    range: 'A1:B2',
  })
  .then((response) => {
    const values = response.data.values;
    if (values.length) {
      console.log('Data:');
      values.forEach((row) => {
        console.log(`${row[0]}, ${row[1]}`);
      });
    } else {
      console.log('No data found.');
    }
  })
  .catch((err) => {
    console.error('The API returned an error:', err);
  });

  return (
        <div>
          <h1>Google Sheets Data</h1>
          <table>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
              </tr>
            </thead>
            <tbody>
              {sheetData.map((row, index) => (
                <tr key={index}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
              }
