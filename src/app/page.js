'use client'
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, ListGroup, Card } from 'react-bootstrap';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [childTopic, setChildTopic] = useState(''); // Added childTopic state
  const [childUrl, setChildUrl] = useState(''); // Added childUrl state
  const [objectArray, setObjectArray] = useState([
    {
      id: 1,
      topic: 'aaa',
      url: 'dcdcd',
      childData: [], // Initialize with an empty array for child data
    },
  ]);

  function removeItem(idToRemove) {
    const updatedList = objectArray.filter((object) => object.id !== idToRemove);
    setObjectArray(updatedList);
  }


  function addChildDataToObject(objectId) {
    setObjectArray((prevObjectArray) => {
      return prevObjectArray.map((object) => {
        if (object.id === objectId) {
          // Add `childTopic` and `childUrl` to the `childData` array
          object.childData.push({ topic: childTopic, url: childUrl });
          setChildTopic(''); // Clear the childTopic input field
          setChildUrl(''); // Clear the childUrl input field
        }
        return object;
      });
    });
  }

  function addWhatIdid() {
    if (topic !== '' && url !== '') {
      const newObject = {
        id: objectArray.length + 1,
        topic,
        url,
        childData: [], // Initialize with an empty array for child data
      };

      setObjectArray([...objectArray, newObject]);
      setTopic('');
      setUrl('');
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
      let stringOfObjectArray = "<Tasks>\n";
      for (let i = 0; i < objectArray.length; i++) {
        stringOfObjectArray += "・" + objectArray[i].topic.toString() + "(" + objectArray[i].url.toString() + " )\n";

        if (objectArray[i].childData) {
          for (let j = 0; j < objectArray[i].childData.length; j++) {
            stringOfObjectArray += "    ・" + objectArray[i].childData[j].topic.toString() + "(" + objectArray[i].childData[j].url.toString() + " )\n";
          }
        }
      }

      stringOfObjectArray += "\n\n<Summary>\n・" + summary.toString();
      sendMessageToSlack(stringOfObjectArray);
    } catch (error) {
      console.error('Error:', error);
    }

    setTopic('');
    setUrl('');
  }

  return (
    <Container className="mt-4">
      {/* give data to AI */}
      <Form onSubmit={handleSubmit}>
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
        <ListGroup className="mt-2">
          {objectArray.map((object) => (
            <Card key={object.id} className="mt-3">
              <Card.Body>
                <div>
                  <strong>Topic:&nbsp;</strong>{object.topic}&nbsp;<strong>URL:</strong> {object.url}
                </div>
                {/* Child Data */}
                {object.childData.length > 0 && (
                  <div>
                    <strong>Child Data:</strong>
                    <ul>
                      {object.childData.map((child, index) => (
                        <li key={index}>
                          <strong>Child Topic:</strong> {child.topic} <strong>Child URL:</strong> {child.url}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <Form.Group>
                    <Form.Label>Child Topic:</Form.Label>
                    <Form.Control
                      type="text"
                      value={childTopic}
                      placeholder="Enter Child Topic"
                      onChange={(e) => setChildTopic(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Child URL:</Form.Label>
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
                    onClick={() => addChildDataToObject(object.id)}
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
          <Button variant="primary">
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
          <Button variant="primary" className="mt-1" type='submit'>
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}