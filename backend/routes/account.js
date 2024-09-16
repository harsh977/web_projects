const express = require('express');
const authMiddleware = require('../middleware').authMiddleware; // Ensure this path is correct
const router = express.Router();
const db = require('../db'); // Ensure this is correctly required

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const query = 'SELECT balance FROM accounts WHERE user_id = $1';
        const values = [userId];

        const result = await db.query(query, values);

        if (result.rows.length > 0) {
            const account = result.rows[0];
            res.json({
                balance: account.balance
            });
        } else {
            res.status(404).json({
                message: 'Account not found'
            });
        }
    } catch (error) {
        console.error('Error retrieving balance:', error);
        res.status(500).json({
            message: 'An error occurred while retrieving the balance'
        });
    }
});

router.post('/transfer', authMiddleware, async (req, res) => {
    const client = await db.connect(); // Get a new client from the pool
    try {
        await client.query('BEGIN'); // Start a transaction

        const { amount, to } = req.body;

        // Fetch the accounts within the transaction
        const accountResult = await client.query('SELECT balance FROM accounts WHERE user_id = $1', [req.userId]);
        const account = accountResult.rows[0];

        if (!account || account.balance < amount) {
            await client.query('ROLLBACK'); // Rollback the transaction
            return res.status(400).json({
                message: 'Insufficient balance'
            });
        }

        const toAccountResult = await client.query('SELECT balance FROM accounts WHERE user_id = $1', [to]);
        const toAccount = toAccountResult.rows[0];

        if (!toAccount) {
            await client.query('ROLLBACK'); // Rollback the transaction
            return res.status(400).json({
                message: 'Invalid account'
            });
        }

        // Perform the transfer
        await client.query('UPDATE accounts SET balance = balance - $1 WHERE user_id = $2', [amount, req.userId]);
        await client.query('UPDATE accounts SET balance = balance + $1 WHERE user_id = $2', [amount, to]);

        // Commit the transaction
        await client.query('COMMIT');

        res.json({
            message: 'Transfer successful'
        });
    } catch (error) {
        console.error('Error during transfer:', error);
        await client.query('ROLLBACK'); // Rollback the transaction in case of error
        res.status(500).json({
            message: 'An error occurred during the transfer'
        });
    } finally {
        client.release(); // Release the client back to the pool
    }
});


module.exports = router;
