// Replace this with your api key from the "API Key Manager" at the tiny.cloud account page
exports.apiKey = 'your-api-key';

// Replace the contents of the private.key file with the one from the "JWT Key Manager" at the tiny.cloud account page
exports.privateKeyFile = ``;

// This is the fake database that the login authenticates against
exports.users = [
  { login: 'johndoe', password: 'password', name: 'John Doe' },
  { login: 'janedoe', password: 'password', name: 'Jane Doe' }
];

// If this is enabled the root of Tiny Drive will be within a directory named as the user login
exports.scopeUser = false;
