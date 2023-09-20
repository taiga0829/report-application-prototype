import axios from "axios";
// Put private Token to here
const SLACK_API_TOKEN = "xoxb-5626190471478-5852348483253-cr5G3AeZcHaVrgIj4J7t9PLC";

export default async function handler(req, res) {
    try {
        
        const response = await axios.post(
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
    } catch (error) {
        console.error('Error sending message to Slack:', error);
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
    }
}