import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// {"web":{"client_id":"57480379418-q1uh9kn7jm5lvonh906ea1j867un72hv.apps.googleusercontent.com","project_id":"working-record-test","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":
// "https://www.googleapis.com/oauth2/v1/certs","client_secret":"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"}}


//servive account auth
//service acount credential json
//next js does auth
//can write and read spreadsheet  

// Create an OAuth 2.0 client
const oauth2Client = new OAuth2Client({
    clientId: '57480379418-q1uh9kn7jm5lvonh906ea1j867un72hv.apps.googleusercontent.com',
    clientSecret: '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',
    //if i create domain, replace it with this.this is for local server
    redirectUri: 'http://localhost:PORT',
});

app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code; // Get the AUTHORIZATION_CODE from the query parameters

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // You can use the access token and refresh token here
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        // Use the 'drive' instance to interact with Google Drive.

        res.send('Authorization successful. You can close this page.');
    } catch (error) {
        console.error('Error getting access token:', error);
        res.status(500).send('Error getting access token.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Generate a URL for the user to visit for authorization
// setting permission for user to access to spreadsheet
const authUrl = oauth2Client.generateAuthUrl({
    // if user is offline for this application, user can accsess to spreadsheet
    access_type: 'offline',
    // 
    scope: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'],
    // setting the prompt to 'consent' will force this consent
    // every time, forcing a refresh_token to be returned.
    prompt: 'consent'
});
console.log(oauth2Client);

// Exchange the code for an access token
oauth2Client.getToken(code)
  .then(({ tokens }) => {
    oauth2Client.setCredentials(tokens);

    // Use the access token to make API requests
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    // You can now use the 'drive' instance to interact with Google Drive.
  })
  .catch((err) => {
    console.error('Error getting access token:', err);
  });

const credentialsPath = './path-to-your-credentials.json'; // Specify the path to your credentials JSON file.

// Use the `fs` module to read the JSON file.
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

const auth = new OAuth2Client({
  clientId: credentials.web.client_id,
  clientSecret: credentials.web.client_secret,
  redirectUri: credentials.web.redirect_uris[0],
});

export default auth;
