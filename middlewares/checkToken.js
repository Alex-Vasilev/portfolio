const jwt = require('jsonwebtoken');
const CONFIG = require('../config');

const checkToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        jwt.verify(token, CONFIG.SECRET_KEY, (err, decoded) => {

            if (err) {ß
                return res.json({
                    err,
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = checkToken;