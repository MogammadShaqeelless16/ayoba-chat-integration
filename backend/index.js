const axios = require('axios');

// Function to get access token
const getAccessToken = async () => {
  try {
    const credentials = '0FBtMSztZbAZqKSGsgzidDu6uFSZimgS:Q6GEGcqGXCmMpD7x';
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    const response = await axios.post('https://api.chenosis.io/oauth/client/accesstoken?grant_type=client_credentials', null, {
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('Access Token Response:', response.data); // Debugging line to verify access token response
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
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
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
};

// Main function to get token and send message
const main = async () => {
  try {
    const accessToken = await getAccessToken();
    console.log('Access Token:', accessToken); // Debugging line to verify access token
    const message = {
      type: 'text',
      text: 'Hello second message!'
    };
    const msisdns = [
      '+27682237174'
    ];
    const result = await sendMessage(accessToken, message, msisdns);
    console.log('Message sent successfully:', result);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

main();
