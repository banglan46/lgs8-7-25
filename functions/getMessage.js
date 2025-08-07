const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = event.headers.authorization?.split(' ')[1];
  if (!token) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const { id } = event.queryStringParameters;
  if (!id) {
    return { statusCode: 400, body: 'Missing email ID' };
  }

  try {
    const response = await fetch(`https://api.mail.tm/messages/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error(await response.text());
    }
    
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};