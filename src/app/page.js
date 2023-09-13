'use client'
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, ListGroup, Card } from 'react-bootstrap';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [childTopic, setChildTopic] = useState(''); // New state for child topics
  const [childUrl, setChildUrl] = useState(''); // New state for child URLs
  const [objectArray, setObjectArray] = useState([
    {
      id: 1,
      topic: 'aaa',
      url: 'dcdcd',
      childTopics: [],
      childUrls: [], // Initialize with an empty array for child URLs
    },
  ]);

  function removeItem(idToRemove) {
    const updatedList = objectArray.filter((object) => object.id !== idToRemove);
    setObjectArray(updatedList);
  }

  function addWhatIdid() {
    if (topic !== '' && url !== '') {
      const newObject = {
        id: objectArray.length + 1,
        topic,
        url,
        childTopics: [],
        childUrls: [], // Initialize with empty arrays for child topics and URLs
      };
      
      setObjectArray([...objectArray, newObject]);
      setTopic('');
      setUrl('');
    }
  }

  function addChildTopicAndUrl(idToAdd) {
    // Find the parent object by id
    const parentObject = objectArray.find((object) => object.id === idToAdd);
    if (parentObject) {
      // Add the child topic and URL to the parent object
      parentObject.childTopics.push(childTopic);
      parentObject.childUrls.push(childUrl);
      setChildTopic(''); // Clear the child topic input field
      setChildUrl(''); // Clear the child URL input field
    }
  }

  async function sendMessageToSlack(messageText) {
    try {
      const response = await axios.post(
        '/api/hello',
        {
          channel: '#development',
          text: messageText,
        },
      );

      console.log('Slack API response:', response.data);
    } catch (error) {
      console.error('Error sending message to Slack:', error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    try {
      sendMessageToSlack(`Topic: ${topic}\n URL: ${url}`);
    } catch (error) {
      console.error('Error:', error);
    }

    setTopic('');
    setUrl('');
  }

  function Summarize(e) {
    e.preventDefault();

    try {
      // sendMessageToSlack(`Topic: ${topic}\n URL: ${url}`);
    } catch (error) {
      console.error('Error:', error);
    }

    setTopic('');
    setUrl('');
  }

  return (
    <Container className="mt-4">
      {/* give data to AI */}
      <Form onSubmit={Summarize}>
        <Card>
          <Card.Body>
            <Form.Group>
              <Form.Label>Topic:&nbsp;</Form.Label>
              <Form.Control
                type="text"
                value={topic}
                placeholder="Enter Main Topic"
                onChange={(e) => setTopic(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>URL:&nbsp;</Form.Label>
              <Form.Control
                type="text"
                value={url}
                placeholder="Enter Main URL"
                onChange={(e) => setUrl(e.target.value)}
              />
            </Form.Group>
            <Button className="mt-2" variant="primary" type="button" onClick={addWhatIdid}>
              Add
            </Button>
          </Card.Body>
        </Card>
      </Form>
      <ListGroup className="mt-2">
        {objectArray.map((object) => (
          <Card key={object.id} className="mt-3">
            <Card.Body>
              <div>
                <strong>Topic:&nbsp;</strong>{object.topic}&nbsp;<strong>URL:</strong> {object.url}
              </div>
              {/* Child Topics and URLs */}
              {object.childTopics.length > 0 && (
                <div>
                  <strong>Topics:&nbsp;</strong>
                  <ul>
                    {object.childTopics.map((child, index) => (
                      <li key={index}>{child}</li>
                    ))}
                  </ul>
                </div>
              )}
              {object.childUrls.length > 0 && (
                <div>
                  <strong>URLs:</strong>
                  <ul>
                    {object.childUrls.map((childUrl, index) => (
                      <li key={index}>{childUrl}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <Form.Group>
                  <Form.Label>Topic:</Form.Label>
                  <Form.Control
                    type="text"
                    value={childTopic}
                    placeholder="Enter Child Topic"
                    onChange={(e) => setChildTopic(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>URL:</Form.Label>
                  <Form.Control
                    type="text"
                    value={childUrl}
                    placeholder="Enter Child URL"
                    onChange={(e) => setChildUrl(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => addChildTopicAndUrl(object.id)}
                  className="mt-3"
                >
                  Add
                </Button>
              </div>
              <div className="button-container">
                <Button
                  variant="danger"
                  onClick={() => removeItem(object.id)}
                  className="mt-1"
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </ListGroup>
      <Form.Group className="mt-2">
        <Button variant="primary" type="submit">
          Summarize
        </Button>
      </Form.Group>
      <Button variant="secondary" className="mt-1" onClick={() => setObjectArray([])}>
        Clear
      </Button>
      {/* TODO: add onSubmit function */}
      <Form.Group className="mt-3">
        <Form.Label style={{ fontSize: 19 }}><strong>Summary</strong></Form.Label>
        <Form.Control
          as="textarea"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <Button variant="primary" className="mt-1" onClick={() => setObjectArray([])}>
          Submit
        </Button>
      </Form.Group>
    </Container>
  );
}
