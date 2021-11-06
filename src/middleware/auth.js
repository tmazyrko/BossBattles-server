const TOKEN_KEY = "039gj0ewg0ju98wgasew0hi9ufWAh9*)FH098WHf(80";
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token =
        req.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;