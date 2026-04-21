const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign(
    { user: { id: "69e7d68c7937068b67ad45ae", role: "praticien" } },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);
console.log(token);
