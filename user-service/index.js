const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
// const serverless = require('serverless-http');
dotenv.config();

const app = express();
app.use(express.json());

// ====== DB POOL (QUAN TRỌNG) ======
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// ================= CRUD =================

// 1. CREATE
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;

        const [result] = await pool.execute(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );

        res.json({
            message: 'User created',
            id: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 2. READ ALL
app.get('/users', async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 3. READ ONE
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [results] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );

        res.json(results[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        await pool.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );

        res.json({ message: 'User updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.use(express.urlencoded({ extended: true }));

// // FIX cho API Gateway
// app.use((req, res, next) => {
//     if (typeof req.body === 'string') {
//         try {
//             req.body = JSON.parse(req.body);
//         } catch (err) {
//             console.error('JSON parse error:', err);
//         }
//     }
//     next();
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
});
