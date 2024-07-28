const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let token = null;

// Function to login and get a token
const login = async (username, password) => {
  try {
    const response = await axios.post(
      "https://api.ayoba.me/v2/login",
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    token = response.data.access_token;
    console.log('Login successful:', token);
    return token;
  } catch (error) {
    console.error('Error during login:', error.response?.data || error.message);
    throw new Error('Failed to login');
  }
};

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await login(username, password);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to check token
const checkToken = (req, res, next) => {
  if (!token) {
    return res.redirect('/');
  }
  next();
};

// Route to handle sending messages
app.post('/send-message', checkToken, async (req, res) => {
  const { message, msisdns } = req.body;
  try {
    const payload = {
      msisdns,
      message: {
        type: 'text', // Assuming 'text' type message
        text: message // Ensure message object has the correct structure
      }
    };
    const response = await axios.post(
      "https://api.ayoba.me/v1/business/message",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route to handle fetching messages
app.get('/messages', checkToken, async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.ayoba.me/v1/business/message",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle fetching account details
app.get('/account-details', checkToken, async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.ayoba.me/v1/business/account",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle updating account details
app.put('/account-details', checkToken, async (req, res) => {
  const details = req.body;
  try {
    const response = await axios.put(
      "https://api.ayoba.me/v1/business/account",
      details,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
