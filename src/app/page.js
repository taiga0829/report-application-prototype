"use client"
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import the axios library
import { Container, Form, Button, Card, Col, Row, Alert } from 'react-bootstrap';

export default function Home() {
  const [topics, setTopics] = useState([
    {
      // id is started from 1
      id: 1,
      label: "",
      url: "",
      //if topics have null in childId, the topis will be child. Conversely,in case topics have have array in childId, they will be child.
      childIds: [],
    },
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const [summary, setSummary] = useState("");
  function renderTopic(topic) {
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
            <>
              {topic.childIds === null ? []
                : topic.childIds.map((childId) => {
                  const childTopic = topics.find((t) => t.id === childId);
                  if (childTopic) {
                    return renderTopic(childTopic);
                  }
                  // Child topic doesn't exist, so don't render it
                  return null;
                })}
              <div className="text-end mt-2">
                {topic.childIds !== null &&
                  <Button onClick={() => handleAddChildButton(topic.id)} style={{ align: 'right' }}>
                    Add Child
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
    const response = await axios.post(
      '/api/request',
      {
        text: messageText,
      }
    );
  }

  const handleRemoveButton = (topicId) => {
    const targetTopic = topics.find((t) => t.id === topicId);
    const isTargetTopicChild = targetTopic.childIds === null;
    const updatedTopics = isTargetTopicChild
      ? topics
        // extract topics other than topic with topicId
        .filter((t) => t.id !== topicId)
        // operation for parent
        .map((t) => {
          return {
            ...t,
            // if childIds includes topicId, remove it  
            childIds:
              t.childIds !== null
                ? t.childIds.filter((id) => id !== topicId)
                : null,
          };
        })
      //child:[1,2,3,4] parent:5 => [1,2,3,4,5] => delete [1,2,3,4,5]
      // delete parent which has topicId and its children which parent has
      : topics.filter((t) => ![...targetTopic.childIds, topicId].includes(t.id));
    setTopics(updatedTopics);
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
    const topicIds = topics.map(topic => topic.id);
    const newTopic = {
      id: Math.max(...topicIds) + 1,
      label: "",
      url: "",
      childIds: null,
    };
    const targetParentTopic = topics.find((topic) => topic.id == parentId);
    const updatedParentTopic = { ...targetParentTopic, childIds: [...targetParentTopic.childIds, newTopic.id] };
    const copiedTopics = [...topics];
    copiedTopics[targetParentTopic.id - 1] = updatedParentTopic;

    const updatedTopics = [
      ...copiedTopics,
      newTopic,
    ]
    setTopics(updatedTopics);
  }

  const handleAddTopicButton = () => {
    const topicIds = topics.map((topic) => topic.id);
    const newTopic = {
      id: Math.max(...topicIds) + 1,
      label: "",
      url: "",
      childIds: [],
    };
    const updatedTopics = [
      ...topics,
      newTopic
    ];
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
      let SubmitText = "<Tasks>\n";
      topics
        // extract ONLY parents
        .filter((t) => t.childIds !== null)
        // add parents and children beloging to parents as string to submitText
        .forEach((topic) => {
          SubmitText += "・" + topic.label + "(" + topic.url + " )\n";
          topic.childIds.forEach((id) => {
            const childTopic = topics.find((topic) => topic.id === id);
            SubmitText += "   ・" + childTopic.label + "(" + childTopic.url + ")\n";
          })
        })
      SubmitText += "\n\n<Summary>\n・" + summary.toString();
      sendMessageToSlack(SubmitText);
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
            Summarize
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
