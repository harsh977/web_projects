const express = require('express');
const router = express.Router();
const zod = require('zod');
const db = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Zod schema for signup validation
const signupBody = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string()
});

// Route for signup
router.post('/signup', async (req, res) => {
  // Parse and validate request body using Zod
  const { success, error } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: 'Invalid input data',
      errors: error.errors
    });
  }

  const { username, password, firstname, lastname } = req.body;

  console.log('Received signup details:');
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('First Name:', firstname);
  console.log('Last Name:', lastname);

  // Check if the user already exists
  const checkUserQuery = 'SELECT * FROM sign WHERE username = $1';
  const checkUserValues = [username];

  try {
    const userCheckResult = await db.query(checkUserQuery, checkUserValues);
    const existingUser = userCheckResult.rows[0];

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already taken'
      });
    }

    // Insert new user into the database
    const insertUserQuery = `
      INSERT INTO sign (username, password, firstname, lastname)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const insertUserValues = [username, password, firstname, lastname];

    const insertResult = await db.query(insertUserQuery, insertUserValues);
    const userId = insertResult.rows[0].id;

    // Create new account with initial balance
    const randomBalanceInINR = 1 + Math.random() * 10000;
    const balanceInPaise = Math.round(randomBalanceInINR * 100);

    const accountQuery = `
      INSERT INTO accounts (user_id, balance)
      VALUES ($1, $2);
    `;
    const accountValues = [userId, balanceInPaise];

    await db.query(accountQuery, accountValues);

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId }, JWT_SECRET);

    // Respond with the token
    res.status(201).json({
      message: 'User created successfully',
      token: token
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred during signup' });
  }
});

// Zod schema for signin validation
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string()
});

// Route for signin
router.post('/signin', async (req, res) => {
  // Validate request body
  const { success, error } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: 'Invalid inputs',
      errors: error.errors
    });
  }

  const { username, password } = req.body;

  // SQL query to find the user by username and password
  const query = `
    SELECT id, password FROM sign WHERE username = $1;
  `;
  const values = [username];

  try {
    // Execute the query
    const result = await db.query(query, values);

    // Check if user exists and password matches
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // For a real application, you should hash passwords and compare hashes
      if (user.password === password) {
        // Generate JWT token
        const token = jwt.sign({
          userId: user.id
        }, JWT_SECRET);

        res.json({
          token: token
        });
        return;
      }
    }

    res.status(401).json({
      message: 'Invalid username or password'
    });
  } catch (error) {
    console.error('Error while logging in:', error);
    res.status(500).json({
      message: 'Error while logging in'
    });
  }
});

// Route for bulk user search
router.get('/bulk', async (req, res) => {
  const filter = req.query.filter || '';

  // SQL query to search users by firstName or lastName
  const query = `
    SELECT username, firstname AS firstName, lastname AS lastName, id AS _id
    FROM sign
    WHERE firstname ILIKE $1
    OR lastname ILIKE $1;
  `;
  const values = [`%${filter}%`];

  try {
    // Execute the query
    const result = await db.query(query, values);

    // Send JSON response
    res.json({
      user: result.rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Error fetching users'
    });
  }
});

module.exports = router;
