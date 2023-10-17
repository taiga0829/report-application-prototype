import axios from 'axios';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Handle the POST request
      const { topics, summary } = req.body;

      // Check if any of the input fields are empty
      const isEmpty = topics.some((topic) => topic.label === '' || topic.url === '');
      if (isEmpty || summary === '') {
        return res.status(400).json({ error: 'Please fill in all the required fields.' });
      }

      let SubmitText = '<Tasks>\n';
      topics
        .filter((t) => t.childIds !== null)
        .forEach((topic) => {
          SubmitText += '・' + topic.label + '(' + topic.url + ' )\n';
          topic.childIds.forEach((id) => {
            const childTopic = topics.find((topic) => topic.id === id);
            SubmitText += '     ・' + childTopic.label + '(' + childTopic.url + ')\n';
          });
        });

      SubmitText += '\n\n<Summary>\n・' + summary;

      const slackAPIResponse = await axios.post(
        'https://slack.com/api/chat.postMessage',
        {
          channel: process.env.SLACK_CHANNEL_NAME,
          text: SubmitText,
        },
        {
          headers: {
            Authorization: 'Bearer ' + process.env.SLACKAPI_TOKEN,
          },
        }
      );

      if (slackAPIResponse.status === 200) {
        // if request is sent to slack, create end of working
        const end_of_working = new Date();
        
        return res.status(200).send('Message sent to Slack successfully.');
      } else {
        return res.status(500).send('Failed to send message to Slack.');
      }
    } else if (req.method === 'GET') {
      // Handle the GET request
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

      const response = await fetch(`https://slack.com/api/users.getPresence?user=${userId}`, requestOptions);
      const data = await response.json(); // Assuming the response is JSON
      console.log(data.online);

      res.status(200).json(data);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

