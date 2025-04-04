const db = require('./db');  // Ensure you import your db functions

// Middleware to check if the user is logged in
function checkUserLoggedIn(req, res, next) {
    const { cookie } = req.body;

    if (!cookie) {
        return res.status(401).json({ message: 'Cookie not provided' });
    }

    // Check if a user exists with this cookie
    db.getUserByCookie(cookie, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid cookie' });
        }

        // If user found with matching cookie, attach user info to the request object
        req.user = user;  // Store user info in req for use in route handler
        next();  // Continue to the next middleware/route handler
    });
}

module.exports = checkUserLoggedIn;
