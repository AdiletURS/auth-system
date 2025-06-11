require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

db.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database error:', err))
    .finally(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    });

// Синхронизация моделей
db.sync({ alter: true });




app.use('/api/auth', authRoutes);

// Проверка работы сервера
app.get('/', (req, res) => {
    res.send('Auth Server is running');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});


