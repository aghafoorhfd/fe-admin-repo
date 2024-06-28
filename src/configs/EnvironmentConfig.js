const API_ENDPOINTS = {
  AUTH_SERVICE: process.env.REACT_APP_AUTH_SERVICE_API_ENDPOINT_URL,
  SUBSCRIPTION_SERVICE: process.env.REACT_APP_SUBSCRIPTION_SERVICE_API_ENDPOINT_URL,
  ADMIN_SERVICE: process.env.REACT_APP_ADMIN_SERVICE_API_ENDPOINT_URL,
  REACT_APP_URL: process.env.REACT_APP_URL
};
const dev = {
  ...API_ENDPOINTS
};

const prod = {
  ...API_ENDPOINTS
};

const test = {
  ...API_ENDPOINTS
};

const staging = {
  ...API_ENDPOINTS
};

const getEnv = () => {
  switch (process.env.REACT_APP_NODE_ENV) {
    case 'development':
      return dev;
    case 'production':
      return prod;
    case 'test':
      return test;
    case 'staging':
      return staging;
    default:
      break;
  }
};

export const env = getEnv();
