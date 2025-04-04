const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.db');

function start() {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );`
    );
}

function getUserByEmail(email, callback) {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
}

function insertUser(name, email, password, callback) {
    db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        callback
    );
}

function getUserByCookie(cookie, callback) {
    db.get('SELECT * FROM users WHERE cookie = ?', [cookie], callback);
}

module.exports = {
    start,
    getUserByEmail,
    insertUser,
    updateUserCookie,
    getUserByCookie
};
