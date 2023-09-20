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
      label: "child topic ID 2",
      url: "",
      childIds: null,
    },
    {
      id: 3,
      label: "",
      url: "",
      childIds: [4],
    },
    {
      id: 4,
      label: "",
      url: "",
      childIds: null,
    },
    {
      id: 5,
      label: "",
      url: "",
      childIds: [],
    },

  ]);
  // empty => throw red alert, suceed => green alert
  const [showAlert, setShowAlert] = useState(false);
  // useEffect(() => {
  //   setTopics([);
  // }, []);
  const [summary, setSummary] = useState("");
  function renderTopic(topic) {
    console.log("Render topic");
    console.log(topic);
    return (
      <Card key={topic.id} style={{ width: '30' }} className="mt-3">
        <Card.Body>
          <Button
            variant="outline-danger"
            onClick={() => handleRemoveButton(topic.id)}
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
              {topic.childIds === null ? []
                : topic.childIds.map((childId) => {
                  const childTopic = topics.find((t) => t.id === childId);
                  if (childTopic) {
                    return renderTopic(childTopic);
                  }
                  return null; // Child topic doesn't exist, so don't render it
                })}
              <div className="text-end mt-2">
                {topic.childIds !== null &&
                  <Button onClick={() => handleAddChildButton(topic.id)} style={{ align: 'right' }}>
                    Add Child {topic.id}
                  </Button>
                }
              </div>
            </>
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
  const handleRemoveButton = (topicId) => {
    //TODO: in case that topicId belongs to child ,search the id in childIds which parent has, 
    //delete proper id in childIds, and delete object having topicId  
    // while this, simply delete children which parent has, then delete parent
    const targetTopic = topics.find((topic) => topic.id === topicId);
    if (targetTopic.childIds === null) {
      //child
      const targetChildID = targetTopic.id;
      //search for same id as targetChildId in parent's childId array and removed id from parent's child array
      const TopicsWithoutChildId = topics.map((topic) => {
        topic.childIds = topic.childIds.filter(childId => childId !== targetChildID);
      })
      // delete child with topicID
      const updatedTopics = TopicsWithoutChildId.filter((topic) => topic.id !== targetChildID);
      setTopics(updatedTopics);
    }
    else {
      //parent
      // remove parent with topic id
      const updatedTopics = topics.filter((topic) => topic.id !== topicId);
      setTopics(updatedTopics);
    }
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
    console.log("topics");
    console.log(topics);
    const newTopic = {
      id: topics.length + 1,
      label: "new child topic test",//TODO: empty it
      url: "",
      childIds: null,
    };
    console.log(newTopic);
    console.log("parent id");
    console.log(parentId);
    const targetParentTopic = topics.find((topic) => topic.id == parentId)
    console.log("targetParentTopic");
    console.log(targetParentTopic);
    // const updatedParentTopic = targetParentTopic.childIds.push(newTopic.id);
    const updatedParentTopic = { ...targetParentTopic, childIds: [...targetParentTopic.childIds, newTopic.id] };
    console.log(updatedParentTopic);

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
        {topics.filter((topic) => topic.childIds !== null).map((topic) => (
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