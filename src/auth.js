// Updated authentication logic using Auth.js v5
import { Auth } from 'auth.js';

const auth = new Auth({
  // configuration options
});

export const authenticateUser = async (credentials) => {
  try {
    const user = await auth.login(credentials);
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication failed');
  }
};
