"use client"
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card, Col, Row, Badge } from 'react-bootstrap';

export default function Home() {
  const [topics, setTopics] = useState([]);
  useEffect(() => {
    // Initialize topics on the client side
    setTopics([
      {
        id: 1,
        label: "labelSample",
        url: "https://example.com",
        childIds: [2, 3],
      },
      {
        id: 2,
        label: "childLabel",
        url: "https://child.example.com",
        childIds: [],
      },
      {
        id: 3,
        label: "childLabelSample",
        url: "https://child.example.com",
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
            <Form.Group as={Row} className="mb-3 mt-4" controlId={`formPlaintextLabel_${topic.id}`}>
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
            <Form.Group as={Row} className="mb-3" controlId={`formPlaintextURL_${topic.id}`}>
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
                    return renderTopic(childTopic);
                  })}
                </>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
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

      // Clear the form fields by setting topics and summary to their initial empty values
      setTopics([]);
      setSummary("");

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