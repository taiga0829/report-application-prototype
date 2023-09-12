'use client'
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Container, Form, Button, ListGroup } from 'react-bootstrap'; // Import Bootstrap components

export default function Home() {
  const [topic, setTopic] = useState('');
  const [url, setUrl] = useState('');
  const [objectArray, setObjectArray] = useState([
    { id: 1, topic: 'aaa', url: 'dcdcd' },
    // Add more objects as needed
  ]);

  function removeItem(idToRemove) {
    const updatedList = objectArray.filter((object) => object.id !== idToRemove);
    setObjectArray(updatedList);
  }

  function addWhatIdid() {
    if (topic !== '' && url !== '') {
      const newObject = { id: objectArray.length + 1, topic, url };
      setObjectArray([...objectArray, newObject]);
      setTopic(''); // Clear the topic input field
      setUrl('');   // Clear the URL input field
    }
  }

  

  function modifyItem(idToModify, newTopic, newUrl) {
    const updatedList = objectArray.map((object) => {
      if (object.id === idToModify) {
        return {
          ...object,
          topic: newTopic,
          url: newUrl,
        };
      }
      return object;
    });
    setObjectArray(updatedList);
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
    e.preventDefault(); // Prevent the form from reloading the page

    try {
      sendMessageToSlack(`Topic: ${topic}\nURL: ${url}`);
    } catch (error) {
      console.error('Error:', error);
    }

    setTopic(''); // Clear the topic input field
    setUrl('');   // Clear the URL input field
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Topic:</Form.Label>
          <Form.Control
            type="text"
            value={topic}
            placeholder="Enter Topic"
            onChange={(e) => setTopic(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            value={url}
            placeholder="Enter URL"
            onChange={(e) => setUrl(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="button" onClick={addWhatIdid}>
          Add
        </Button>
        <Button variant="primary" type="submit">
          Submit form
        </Button>
      </Form>
      <ListGroup>
        {objectArray.map((object) => (
          <ListGroup.Item key={object.id}>
            <div>
              <strong>Topic:</strong> {object.topic}, <strong>URL:</strong> {object.url}
            </div>
            <div className="button-container">
              <Button
                variant="danger"
                onClick={() => removeItem(object.id)}
              >
                Delete
              </Button>
              <Button
                variant="warning"
                onClick={() => modifyItem(object.id)}
              >
                Modify
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button variant="primary" onClick={() => setObjectArray([])}>
        Clear
      </Button>
    </Container>
  );
}
