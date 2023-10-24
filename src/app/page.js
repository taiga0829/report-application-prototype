"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import the axios library
import { Form, Button, Container, Alert } from 'react-bootstrap';
import TopicCard from './topicCard';
import ExportExcelButton from './ExportExcelButton';

export default function Page() {
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
  const [isRunning, setIsRunning] = useState(true);
  const [userCurrentStatus, setUserCurrentStatus] = useState("");

  useEffect(() => {
    getCurrentStatus()
      .then((status) => {
        setUserCurrentStatus(status);
        console.log("userCurrentStatus in useEffect:", status);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

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

  async function handleToggleRun(e) {
    setIsRunning(!isRunning);
    e.preventDefault();
    console.log("userCurrentStatus in handleToggleRun:", userCurrentStatus);
    if (!isRunning) {
      try {
        const response = await axios.post('/api/workingStatus', {
          message: 'Restart',
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post('/api/workingStatus', {
          message: 'Stop',
        });

      } catch (error) {
        console.error(error);
      }
    }
  }

  async function getCurrentStatus() {
    const response = await axios.get('/api/workingStatus');
    const userData = response.data.data; // Assuming your data is in the 'data' property

    if (userData.length > 0) {
      const userCurrentStatus = userData[userData.length - 1][1];
      return userCurrentStatus;
    } else {
      // Handle the case where the array is empty
      return null; // or any other appropriate value
    }
  }

  // Example usage:
  getCurrentStatus()
    .then((status) => {
      if (status === 'Stop') {
        console.log('The user\'s current status is Stop.');
      } else {
        console.log('The user\'s current status is not Stop.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });


  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post(
      '/api/request',
      {
        topics,
        summary
      }

    );
    const response2 = await axios.post(
      'api/workingStatus',
      {
        message: "Finish"
      }
    )
  }
  return (
    <Container className="mt-4">
      <ExportExcelButton></ExportExcelButton>
      <Form onSubmit={handleSubmit}>
        {topics.filter((topic) => topic.childIds !== null).map((topic) => (
          <TopicCard key={topic.id}
            topic={topic}
            handleRemoveButton={handleRemoveButton}
            handleLabelChange={handleLabelChange}
            handleURLChange={handleURLChange}
            handleAddChildButton={handleAddChildButton}
            topics={topics}>
          </TopicCard>
        ))}
        <div className="d-flex justify-content-between mt-3">
          <Button variant="primary" className="mx-5">
            Summarize
          </Button>
          <Button
            onClick={handleToggleRun}
            variant={isRunning ? "danger" : "primary"}
            disabled={userCurrentStatus === "Finish"}
          >
            {isRunning ? "Stop" : userCurrentStatus === "Stop" ? "Restart" : "Stop"}
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

