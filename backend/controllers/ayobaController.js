const axios = require('axios');

const getToken = async () => {
  const response = await axios.post(process.env.TOKEN_URL, null, {
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET
    }
  });
  return response.data.access_token;
};

exports.sendMessage = async (req, res) => {
  const { message, msisdns } = req.body;
  try {
    const token = await getToken();
    const response = await axios.post('https://api.chenosis.io/ayoba/com/v1/business/message', {
      message,
      msisdns
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.response.data });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const token = await getToken();
    const response = await axios.get('https://api.chenosis.io/ayoba/com/v1/business/message', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve messages', error: error.response.data });
  }
};
