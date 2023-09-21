import axios from "axios";
// Put private Token to here
const SLACK_API_TOKEN = "xoxb-5626190471478-5852348483253-cr5G3AeZcHaVrgIj4J7t9PLC";

export default async function handler(req, res) {
    try {
        const slackAPIResponse = await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
                channel: req.body.channel,
                text: req.body.text,
            },
            {
                headers: {
                    Authorization: 'Bearer ' + SLACK_API_TOKEN,
                },
            }
        );
        console.log(slackAPIResponse);
        if (slackAPIResponse.status === 200) {
            res.status(200).send();
        } else {
            res.status(500).send();
        }
    } catch (error) {
        res.status(500).send();
        console.error('Error sending message to Slack:', error);
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
    }
}