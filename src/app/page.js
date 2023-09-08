'use client'
import React, { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios';
const SLACK_API_TOKEN = "xoxb-5626190471478-5852348483253-cr5G3AeZcHaVrgIj4J7t9PLC";
export default function Home() {
  const [input, setInput] = useState('');

  async function sendMessageToSlack(messageText) {
    try {
      const response = await axios.post(
        '/api/hello',
        {
          channel: '#development',
          text: messageText, // Use the 'messageText' argument here
        },
        {
          headers: {
            Authorization: 'Bearer ' + SLACK_API_TOKEN,
          },
        }
      );

      console.log('Slack API response:', response.data);
    } catch (error) {
      console.error('Error sending message to Slack:', error);
    }
  }


  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    try {
      sendMessageToSlack(input);
    } catch (error) {
      console.error('Error:', error);
    }
    setInput("");
  }
  return (
    <form method="post" onSubmit={handleSubmit}>
      <div>
        <label>
          Text input:
          <input
            value={input}
            name='text' onChange={e => setInput(e.target.value)} />
        </label>
        <button type="submit" >Submit form</button>
      </div>
    </form>
  )
}

