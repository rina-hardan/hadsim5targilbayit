
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const sendRequest = async ({ method, url, body = null, headers = {} }) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    data: body,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.error || 'שגיאה לא מזוהה';
  }
};

export default sendRequest;
