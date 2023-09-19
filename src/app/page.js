"use client"
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card, Col, Row, Badge } from 'react-bootstrap';

export default function Home() {
  const [topics, setTopics] = useState([]);
  useEffect(() => {
    setTopics([
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
        childIds: [],
      },
    ]);
  }, []);
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
          <Form onSubmit={handleSubmit}>
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
              {topic.childIds.length > 0 && (
                <>
                  {topic.childIds.map((childId) => {
                    const childTopic = topics.find((t) => t.id === childId);
                    if (childTopic) {
                      return renderTopic(childTopic);
                    }
                    return null; // Child topic doesn't exist, so don't render it
                  })}
                  <div className="text-end mt-2">
                    {topic.childIds.length > 0 && (
                      <Button onClick={() => addTopic(topic.id)} style={{ align: 'right' }}>
                        Add Child
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  async function sendMessageToSlack(messageText) {
    try {

      const response = await axios.post(
        'https://slack.com/api/chat.postMessage',
        '/api/hello',
        {
          channel: '#development',
          text: messageText,

        }
      )
    } catch (error) {
      console.error('Error sending message to Slack:', error);
    }
  }
  function addChildTopic(parentId, newChildId) {
    const updatedTopics = topics.map((topic) => {
      if (topic.id === parentId) {
        return {
          ...topic,
          childIds: [...topic.childIds, newChildId],
        };
      }
      return topic;
    });

    setTopics(updatedTopics);
  }

  function removeTopic(idToRemove) {
    const updatedTopics = topics.filter((topic) => topic.id !== idToRemove);
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

  const addTopic = (parentId) => {
    const newTopic = {
      id: topics.length + 1,
      label: "",
      url: "",
      childIds: [],
    };

    const updatedTopics = topics.map((topic) => {
      if (topic.id === parentId) {
        return {
          ...topic,
          childIds: [...topic.childIds, newTopic.id],
        };
      }
      return topic;
    });

    setTopics([...updatedTopics, newTopic]);
  };

  function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      let SubmitText = "<Tasks>\n";
      for (let i = 0; i < topics.length; i++) {
        SubmitText += "・" + topics[i].label.toString() + "(" + topics[i].url.toString() + " )\n";

        if (topics[i].childIds.length > 0) {
          for (let j = 0; j < topics[i].childIds.length; j++) {
            const childTopic = topics.find((t) => t.id === topics[i].childIds[j]);
            SubmitText += "    ・" + childTopic.label.toString() + "(" + childTopic.url.toString() + " )\n";
          }
        }
      }

      SubmitText += "\n\n<Summary>\n・" + summary.toString();
      sendMessageToSlack(SubmitText);

      if (isSent) {
        return <h1>Thanks for feedback!</h1>
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <Container className="mt-4">
      {/* It checks if the current topic is NOT a child of any other topic. */}
      {topics.filter((topic) => !topics.some((t) => t.childIds.includes(topic.id))).map((topic) => (
        renderTopic(topic)
      ))}
      <div className="d-flex justify-content-between mt-3">
        <Button variant="primary" className="mx-5">
          Summarize
        </Button>
        <Button variant="primary" onClick={() => addTopic(null)} className="mx-5">
          Add
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
    </Container>
  );

}