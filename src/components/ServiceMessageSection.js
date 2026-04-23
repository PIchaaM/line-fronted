import { useState } from 'react';

export const ServiceMessageSection = ({ accessToken, onSendServiceMessage }) => {
  const [serviceMessage, setServiceMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendServiceMessage = async () => {
    if (!accessToken) {
      alert("No access token available");
      return;
    }

    setLoading(true);
    try {
      const data = await onSendServiceMessage(accessToken);
      if (data) {
        setServiceMessage(JSON.stringify(data, null, 2));
        alert("Message sent successfully!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <fieldset>
      <legend>Service Message:</legend>
      {serviceMessage && (
        <p id="serviceMessage">
          <b>Response:</b>
          <pre>{serviceMessage}</pre>
        </p>
      )}
      <button id="btnServiceMessage" onClick={handleSendServiceMessage} disabled={loading}>
        {loading ? 'Sending...' : 'Send Service Message'}
      </button>
    </fieldset>
  );
};
