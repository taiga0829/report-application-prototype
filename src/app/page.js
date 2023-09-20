"use client"
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import the axios library
import { Container, Form, Button, Card, Col, Row, Alert } from 'react-bootstrap';

export default function Home() {
  const [topics, setTopics] = useState([
    {
      id: 1,
      label: "",
      url: "",
      childIds: [2],
    },
    {
      id: 2,
      label: "",
      url: "",
      childIds: [],
    },
    // {
    //   id: 3,
    //   label: "",
    //   url: "",
    //   childIds: [4],
    // },
    // {
    //   id: 4,
    //   label: "",
    //   url: "",
    //   childIds: [],
    // },
  ]);
  // empty => throw red alert, suceed => green alert
  const [showAlert, setShowAlert] = useState(false);
  // useEffect(() => {
  //   setTopics([);
  // }, []);
  const [summary, setSummary] = useState("");
  function renderTopic(topic) {
    return (
      <Card key={topic.id} style={{ width: '30' }} className="mt-3">
        <Card.Body>
          <Button
            variant="outline-danger"
            onClick={() => removeTopic(topic.id)}
            className="position-absolute btn-sm top-0 end-0 mt-2 me-2"
          >
            X
          </Button>
          Topic:
          <Form.Group as={Row} className="mb-3 mt-4">
            <Form.Label style={{ textAlign: 'right' }} column sm="2">
              Label:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                placeholder="Enter label:"
                value={topic.label}
                onChange={(e) => handleLabelChange(e, topic.id)}
                style={{ textAlign: 'left' }}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label style={{ textAlign: 'right' }} column sm="2">
              URL:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                placeholder="Enter URL:"
                onChange={(e) => handleURLChange(e, topic.id)}
                value={topic.url}
              />
            </Col>
          </Form.Group>
          <div>
            {/* {topic.childIds.length < 6  && ( */}
            <>
              {topic.childIds.map((childId) => {
                const childTopic = topics.find((t) => t.id === childId);
                if (childTopic) {
                  return renderTopic(childTopic);
                }
                return null; // Child topic doesn't exist, so don't render it
              })}
              <div className="text-end mt-2">
                {/* {topic.childIds.length > 0 && ( */}
                <Button onClick={() => handleAddChildButton(topic.id)} style={{ align: 'right' }}>
                  Add Child
                </Button>
                {/* )} */}
              </div>
            </>
            {/* )} */}
          </div>
        </Card.Body>
      </Card>
    );
  }
  async function sendMessageToSlack(messageText) {
    try {
      const response = await axios.post( // Use axios for the HTTP request
        '/api/hello',
        {
          channel: '#development',
          text: messageText,
        }
      );
      // Handle the response as needed
    } catch (error) {
      console.error('Error sending message to Slack:', error);
    }
  }
  function removeTopic(idToRemove) {
    const updatedTopics = [];

    // Define a recursive function to remove children
    function removeTopicRecursive(topicId) {
      const topicToRemove = topics.find((topic) => topic.id === topicId);
      if (topicToRemove) {
        updatedTopics.push(topicToRemove);
        topicToRemove.childIds.forEach((childId) => {
          removeTopicRecursive(childId);
        });
      }
    }

    // Start the recursive removal process with the parent topic
    removeTopicRecursive(idToRemove);

    setTopics((prevTopics) => prevTopics.filter((topic) => !updatedTopics.includes(topic)));
  }

  const handleURLChange = (e, topicId) => {
    const updatedTopics = topics.map((topic) => {
      if (topic.id === topicId) {
        return {
          ...topic,
          url: e.target.value,
        };
      }
      return topic;
    });
    setTopics(updatedTopics);
  };

  const handleLabelChange = (e, topicId) => {
    const updatedTopics = topics.map((topic) => {
      if (topic.id === topicId) {
        return {
          ...topic,
          label: e.target.value,
        };
      }
      return topic;
    });

    setTopics(updatedTopics);
  };

  const handleAddChildButton = (parentId) => {
    const newTopic = {
      id: topics.length + 1,
      label: "new child topic test",//TODO: empty it
      url: "",
      childIds: [],
    };
    console.log(newTopic);

    const targetParentTopic = topics.find((topic) => topic.id == parentId)
    // const updatedParentTopic = targetParentTopic.childIds.push(newTopic.id);
    const updatedParentTopic = { ...targetParentTopic, childIds: [...targetParentTopic.childIds, newTopic.id] };
    console.log(updatedParentTopic);
    console.log(topics);
    // const copiedTopics = topics.concat();
    const copiedTopics = [...topics];
    console.log("copiedTopics 1");
    console.log(copiedTopics);
    copiedTopics[targetParentTopic.id - 1] = updatedParentTopic;
    console.log("copiedTopics 2");
    console.log(copiedTopics);

    const updatedTopics = [
      ...copiedTopics,
      newTopic,

    ]
    console.log(updatedTopics);
    setTopics(updatedTopics);
    // const updatedTopics = topics.map((topic) => {
    //   if (topic.id === parentId) {
    //     return {

    //       childIds: [...topic.childIds, newTopic.id],
    //     };
    //   }
    //   return topic;
    // });

    // setTopics([...updatedTopics, newTopic]);

  }

  const handleAddTopicButton = () => {
    const newTopic = {
      id: topics.length + 1,
      label: "new topic test",//TODO: empty it
      url: "",
      childIds: [],
    };
    console.log(topics);
    const updatedTopics = [
      ...topics,
      newTopic
    ];
    console.log(updatedTopics);
    setTopics(updatedTopics);

  };




  function handleSubmit(e) {
    e.preventDefault();
    // Check if any of the input fields are empty
    const isEmpty = topics.some((topic) => topic.label === '' || topic.url === '');
    if (isEmpty || summary === '') {
      // Show the Bootstrap alert
      setShowAlert(true);
    } else {
      setShowAlert(false); // Hide the alert if the form is valid
      try {
        let SubmitText = "<Tasks>\n";
        let arr = [];


        for (let i = 0; i < topics.length; i++) {
          if (!arr.includes(topics[i].id)) {
            SubmitText += "・" + topics[i].label.toString() + "(" + topics[i].url.toString() + " )\n";
            arr.push(topics[i].id);
          }

          if (topics[i].childIds.length > 0) {
            for (let j = 0; j < topics[i].childIds.length; j++) {
              const childTopic = topics.find((t) => t.id === topics[i].childIds[j]);
              if (!arr.includes(childTopic.id)) {
                SubmitText += "    ・" + childTopic.label.toString() + "(" + childTopic.url.toString() + " )\n";
                arr.push(childTopic.id);
              }

            }
          }
        }

        SubmitText += "\n\n<Summary>\n・" + summary.toString();
        console.log(SubmitText);

        sendMessageToSlack(SubmitText);

      } catch (error) {
        console.error('Error:', error);
      }
    }

  }

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit}>
        {topics.filter((topic) => !topics.some((t) => t.childIds.includes(topic.id))).map((topic) => (
          renderTopic(topic)
        ))}
        <div className="d-flex justify-content-between mt-3">
          <Button variant="primary" className="mx-5">
            Summarized by AI
          </Button>
          <Button variant="primary" onClick={() => handleAddTopicButton(null)} className="mx-5">
            Add Topic
          </Button>
        </div>
        <div className="form-floating">
          <textarea
            onChange={(e) => setSummary(e.target.value)}
            className="form-control mt-3"
            id="floatingTextarea2"
            style={{ height: '100px' }}
          ></textarea>
          <label htmlFor="floatingTextarea2">Summary</label>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <Button variant="primary" type="submit" className="mx-5">
            Submit
          </Button>
        </div>
        {showAlert && (
          <Alert variant="danger" className="mt-3">
            Please fill in all the required fields.
          </Alert>
        )}
      </Form>
    </Container>
  );
}