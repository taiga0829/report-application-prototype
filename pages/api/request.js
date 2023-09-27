import axios from "axios";

export default async function handler(req, res) {
    try {
        //req.body.topics will be assigned to the topics variable, and req.body.summary will be assigned to the summary variable.
        const { topics, summary } = req.body; 

        // Check if any of the input fields are empty
        const isEmpty = topics.some((topic) => topic.label === "" || topic.url === "");
        if (isEmpty || summary === "") {
            //400 means that the request sent to the server is invalid or corrupted
            return res.status(400).json({ error: "Please fill in all the required fields." });
        }

        let SubmitText = "<Tasks>\n";
        topics
            // extract ONLY parents
            .filter((t) => t.childIds !== null)
            // add parents and children belonging to parents as string to SubmitText
            .forEach((topic) => {
                SubmitText += "・" + topic.label + "(" + topic.url + " )\n";
                topic.childIds.forEach((id) => {
                    const childTopic = topics.find((topic) => topic.id === id);
                    SubmitText += "     ・" + childTopic.label + "(" + childTopic.url + ")\n";
                });
            });

        SubmitText += "\n\n<Summary>\n・" + summary;

        const slackAPIResponse = await axios.post(
            "https://slack.com/api/chat.postMessage",
            {
                channel: process.env.SLACK_CHANNEL_NAME,
                text: SubmitText, // Use the generated text
            },
            {
                headers: {
                    Authorization: "Bearer " + process.env.SLACKAPI_TOKEN,
                },
            }
        );

        if (slackAPIResponse.status === 200) {
            return res.status(200).send("Message sent to Slack successfully.");
        } else {
            return res.status(500).send("Failed to send message to Slack.");
        }
    } catch (error) {
        console.log(error);
        console.error("Error sending message to Slack:", error);
        console.error("Error response data:", error.response ? error.response.data : "N/A");
        console.error("Error response status:", error.response ? error.response.status : "N/A");
        return res.status(500).send("Internal server error.");
    }
}
