"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    // Fetch user's status immediately when the component mounts
    getCurrentStatus()
      .then((status) => {
        setUserCurrentStatus(status);
        console.log("userCurrentStatus in useEffect:", status);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Set up an interval to fetch user's status every 1 minute
    const statusInterval = setInterval(() => {
      getCurrentStatus()
        .then((status) => {
          setUserCurrentStatus(status);
          console.log("userCurrentStatus in interval:", status);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }, 60000); // 1 minute in milliseconds

    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  async function createNewSheet() {

    try {
      const response = await axios.post('/api/createSheet');
    } catch (error) {
      console.error(error);
    }
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

  async function handleStartButton(e) {
    // send POST to spreadsheet to input "Start"
    try {
      const response = await axios.post('/api/workingStatus', {
        message: 'start',
      });
    } catch (error) {
      console.error(error);
    }
    //set status "start"
    setUserCurrentStatus("start");
  }

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

    getCurrentStatus()
      .then((status) => {
        setUserCurrentStatus(status);
        console.log("userCurrentStatus in handleToggleRun:", status);
      })
      .catch((error) => {
        console.error(error);
      });


    try {
      const response = await axios.post('/api/workingStatus', {
        message: 'stop',
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function getCurrentStatus() {
    const response = await axios.get('/api/workingStatus');
    const userData = response.data.data; // Assuming your data is in the 'data' property
    console.log(userData);

    if (userData.length > 0) {
      const userCurrentStatus = userData[userData.length - 1][1];
      console.log(userCurrentStatus);
      return userCurrentStatus;
    } else {
      // Handle the case where the array is empty
      return null; // or any other appropriate value
    }
  }

  async function handleCreateNewSheet() {
    try {
      // Make an API request to the server-side endpoint to create a new sheet
      const response = await axios.post('/api/createSheet', {
        // Any necessary request data
      });
      console.log(response.data.message); // Handle the response as needed
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateNewFile() {
    try {
      // Make an API request to the server-side endpoint to create a new sheet
      const response = await axios.post('/api/createFile', {
      });
      console.log(response.data.message); // Handle the response as needed
    } catch (error) {
      console.error(error);
    }
  }

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
      {userCurrentStatus === "standby" && <Alert variant="primary">
        <Alert.Heading>Detect local changes!!!</Alert.Heading>
        <p>
          The system detected local changes on which you are working on git repository.<br></br>
          <strong>wanna start working?</strong>
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="danger" onClick={() => setUserCurrentStatus("stop")} className="mr-5">
            Close
          </Button>
          <Button variant="primary" onClick={handleStartButton}>
            Start
          </Button>
        </div>
      </Alert>
      }
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
            variant={userCurrentStatus === "stop" ? "primary" : "danger"}
            disabled={userCurrentStatus === "standby"}
          >
            {userCurrentStatus == "standby" ? "Start" : "stop"}
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
          <Button variant="primary" onClick={handleCreateNewSheet} className="mx-5">
            c
          </Button>
        </div>
      </Form>
    </Container>
  );
}

