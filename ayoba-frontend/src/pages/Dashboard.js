import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [msisdns, setMsisdns] = useState('');
  const [response, setResponse] = useState(null);

  const handleSendMessage = async () => {
    const msisdnsArray = msisdns.split(',').map(msisdn => msisdn.trim());
    try {
      const res = await axios.post('http://localhost:5000/api/ayoba/send-message', {
        message: { type: 'text', text: message },
        msisdns: msisdnsArray
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setResponse(res.data);
    } catch (error) {
      setResponse({ error: error.response.data });
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <div>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message"></textarea>
        <input type="text" value={msisdns} onChange={(e) => setMsisdns(e.target.value)} placeholder="MSISDNs (comma separated)" />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
