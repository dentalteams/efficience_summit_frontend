const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun jeton fourni.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Jeton invalide.' })
    }
};
