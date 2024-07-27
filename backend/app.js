const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Function to get access token
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://api.chenosis.io/oauth/client/accesstoken?grant_type=client_credentials', null, {
      headers: {
        'Authorization': `Basic ${Buffer.from('0FBtMSztZbAZqKSGsgzidDu6uFSZimgS:Q6GEGcqGXCmMpD7x').toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('Access token response:', response.data); // Log token response
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
};

// Function to send message
const sendMessage = async (accessToken, message, msisdns) => {
  try {
    const response = await axios.post('https://api.chenosis.io/ayoba/com/v1/business/message', {
      message: message,
      msisdns: msisdns
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Send message response:', response.data); // Log message response
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw new Error('Failed to send message');
  }
};

// Function to fetch messages
const fetchMessages = async (accessToken) => {
  try {
    const response = await axios.get('https://api.chenosis.io/ayoba/com/v1/business/messages', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('Fetch messages response:', response.data); // Log fetch messages response
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error.response?.data || error.message);
    throw new Error('Failed to fetch messages');
  }
};

// Function to fetch account details
const fetchAccountDetails = async (accessToken) => {
  try {
    const response = await axios.get('https://api.chenosis.io/ayoba/com/v1/business/account', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('Fetch account details response:', response.data); // Log account details response
    return response.data;
  } catch (error) {
    console.error('Error fetching account details:', error.response?.data || error.message);
    throw new Error('Failed to fetch account details');
  }
};

// Function to update account details
const updateAccountDetails = async (accessToken, details) => {
  try {
    const response = await axios.put('https://api.chenosis.io/ayoba/com/v1/business/account', details, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Update account details response:', response.data); // Log update account details response
    return response.data;
  } catch (error) {
    console.error('Error updating account details:', error.response?.data || error.message);
    throw new Error('Failed to update account details');
  }
};

// Route to handle sending messages
app.post('/send-message', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const { message, msisdns } = req.body;
    const result = await sendMessage(accessToken, message, msisdns);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle fetching messages
app.get('/messages', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const messages = await fetchMessages(accessToken);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle fetching account details
app.get('/account-details', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const accountDetails = await fetchAccountDetails(accessToken);
    res.json(accountDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle updating account details
app.put('/account-details', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const details = req.body;
    const result = await updateAccountDetails(accessToken, details);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
