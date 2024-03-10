const userService = require('../model/dbuserModel'); // Assuming you have a service layer

// Controller function for user authentication
const authenticateUser = async (req, res) => {
  const { nom, password } = req.body;

  try {
    const user = await userService.authenticateUser(nom, password);

    if (user) {
      // Authentication successful
      res.status(200).json({ message: 'Authentication successful', user });
    } else {
      // Authentication failed
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error in authentication controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function for user registration
const addUser = async (req, res) => {
  const { nom, password } = req.body;

  try {
    const user = await userService.addUser(nom, password);

    // Registration successful
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error in user registration controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  authenticateUser,
  addUser
};
