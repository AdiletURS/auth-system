const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Генерация токенов
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// Регистрация
exports.register = async (req, res) => {
    try {
        const { login, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ login, password: hashedPassword });
        res.status(201).json({ userId: user.id });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
};

// Логин
exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await User.findOne({ where: { login } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokens = generateTokens(user.id);
        res.json(tokens);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

// Обновление токена
exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const tokens = generateTokens(decoded.userId);
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};