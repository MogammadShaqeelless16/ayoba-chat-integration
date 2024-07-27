const axios = require('axios');

// Function to get access token
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://api.chenosis.io/oauth/client/accesstoken?grant_type=client_credentials', null, {
      headers: {
        'Authorization': `Basic ${Buffer.from('2K93H9CxS7owNHcpMtJTGQjh4D9zhtDZ:A6I8vHvcJ0gfcfb5').toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
};

// Function to fetch message
const fetchMessage = async (accessToken) => {
  try {
    const response = await axios.get('https://api.chenosis.io/ayoba/com/v1/business/message', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching message:', error.response?.data || error.message);
    throw error;
  }
};

// Main function to get token and fetch message
const main = async () => {
  try {
    const accessToken = await getAccessToken();
    console.log('Access Token:', accessToken); // Debugging line to verify access token
    const result = await fetchMessage(accessToken);
    console.log('Fetched message successfully:', result);
  // Assuming the result contains a 'text' field
  if (result && result.message && result.message.text) {
    console.log('Message Text:', result.message.text);
  } else {
    console.log('No text found in the fetched message.');
  }
} catch (error) {
  console.error('Failed to fetch message:', error);
}
};

main();
