const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const URLSearchParams = require('url').URLSearchParams;

/**
 * LeaguepediaClient - Handles authentication and API requests to Leaguepedia MediaWiki API
 * Uses bot password authentication to access higher rate limits (60 hits/min instead of 5)
 */

class LeaguepediaClient {
  constructor() {
    this.baseUrl = 'https://lol.fandom.com/api.php';

    const cookieJar = new CookieJar();

    this.session = wrapper(axios.create({
      jar: cookieJar,
      withCredentials: true,
    }));

    this.isAuthenticated = false;
    this.authAttempts = 0;
    this.maxAuthAttempts = 3;
  }

  /**
   * Fetch a login token from the MediaWiki API
   * Required as first step before logging in with bot password
   */
  async fetchLoginToken() {
    try {
      const response = await this.session.get(this.baseUrl, {
        params: {
          action: 'query',
          meta: 'tokens',
          type: 'login',
          format: 'json',
        },
      });

      if (!response.data.query || !response.data.query.tokens) {
        throw new Error('Failed to fetch login token');
      }

      return response.data.query.tokens.logintoken;
    } catch (error) {
      console.error('Error fetching login token:', error.message);
      throw error;
    }
  }

  /**
   * Login to Leaguepedia using bot password credentials
   * This authenticates the session for higher rate limits
   */
  async login() {
    try {
      if (this.authAttempts >= this.maxAuthAttempts) {
        throw new Error('Max authentication attempts exceeded');
      }

      this.authAttempts++;

      const botUsername = process.env.LEAGUEPEDIA_BOT_USERNAME;
      const botPassword = process.env.LEAGUEPEDIA_BOT_PASSWORD;

      if (!botUsername || !botPassword) {
        throw new Error('Leaguepedia bot credentials not found in environment variables');
      }

      //console.log(`Attempting to login as: ${botUsername}`);
      const loginToken = await this.fetchLoginToken();
      //console.log(`Login token fetched successfully`);

      //IMPORTANT: Use URLSearchParams for proper form-encoded POST data
      const loginData = new URLSearchParams();
      loginData.append('action', 'login');
      loginData.append('lgname', botUsername);
      loginData.append('lgpassword', botPassword);
      loginData.append('lgtoken', loginToken);
      loginData.append('format', 'json');

      //console.log('Sending login request to:', this.baseUrl);
      const response = await this.session.post(this.baseUrl, loginData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      //console.log('Login response status:', response.status);
      //console.log('Login response data:', JSON.stringify(response.data, null, 2));

      //Check if login was successful
      if (!response.data.login) {
        throw new Error('Invalid login response - missing login field in response');
      }

      const loginResult = response.data.login;

      if (loginResult.result === 'Success') {
        this.isAuthenticated = true;
        this.authAttempts = 0;
        //console.log(`Successfully authenticated as ${loginResult.lgusername}`);
        return true;
      } else if (loginResult.result === 'Failed') {
        throw new Error(`Login failed: ${loginResult.reason || 'Unknown reason'}`);
      } else {
        throw new Error(`Unexpected login result: ${loginResult.result}`);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      this.isAuthenticated = false;
      throw error;
    }
  }

  /**
   * Ensure authenticated session - logs in if not already authenticated
   */
  async ensureAuthenticated() {
    if (!this.isAuthenticated) {
      await this.login();
    }
  }

  /**
   * Make an authenticated GET request to the Leaguepedia API
   * Automatically handles login if needed
    */
  async get(params) {
    try {
      await this.ensureAuthenticated();

      const response = await this.session.get(this.baseUrl, {
        params: {
          ...params,
          format: params.format || 'json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error making API request:', error.message);
      throw error;
    }
  }

  /**
   * Make an authenticated POST request to the Leaguepedia API
   * Automatically handles login if needed
   */
  async post(params) {
    try {
      await this.ensureAuthenticated();

      const response = await this.session.post(this.baseUrl, null, {
        params: {
          ...params,
          format: params.format || 'json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error making API POST request:', error.message);
      throw error;
    }
  }

 
//Logout from the authenticated session
   
  async logout() {
    try {
      const token = await this.fetchLoginToken();
      await this.session.post(this.baseUrl, null, {
        params: {
          action: 'logout',
          token: token,
        },
      });
      this.isAuthenticated = false;
      //console.log('Successfully logged out');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  }
}

//Create and export a singleton instance
const leaguepediaClient = new LeaguepediaClient();

module.exports = leaguepediaClient;
