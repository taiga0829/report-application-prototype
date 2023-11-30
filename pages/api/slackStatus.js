export default async function handler(req, res) {

      const spreadsheetId = process.env.SPREADSHEET_ID;
if(req.method == "GET"){
    const userId = 'U05Q6P7BYBV';
    const myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      'Bearer xoxp-5626190471478-5822789406403-5852348460501-69cbae98ee7fc3400c4ff33e66ab5154'
    );
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    try{
      const response = await fetch(`https://slack.com/api/users.getPresence?user=${userId}`, requestOptions);
      const data = await response.json(); // Assuming the response is JSON
      console.log(data.online);
      res.status(200).json({ message: 'GET request successful', slackData: data });
    }catch{
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}