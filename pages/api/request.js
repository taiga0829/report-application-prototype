import axios from "axios";

export default async function handler(req, res) {
    try {
        const slackAPIResponse = await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
                channel: process.env.SLACK_CHANNEL_NAME,
                text: req.body.text,
            },
            {
                headers: {
                    Authorization: 'Bearer ' + process.env.SLACKAPI_TOKEN,
                },
            }
        );
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