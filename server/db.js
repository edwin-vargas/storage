const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.db');

function start() {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fileName TEXT NOT NULL,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

function getUserIdByName(name, callback) {
    db.get('SELECT id FROM users WHERE name = ?', [name], (err, row) => {
        if (err) {
            console.error('Error fetching user ID by name:', err);
            return callback(err, null);
        }
        callback(null, row ? row.id : null); // If the user exists, return their ID
    });
}

function SaveFileInfo(fileName, user_id, callback) {
    db.run(
        `INSERT INTO files (fileName, user_id) VALUES (?, ?)`,
        [fileName, user_id],
        callback
    );
}

function GetUserFiles(user_id, callback) {
    db.all(
        `SELECT * FROM files WHERE user_id = ?`,
        [user_id],
        (err, rows) => {
            if (err) {
                console.error('Error fetching user files:', err);
                return callback(err, null);
            }
            callback(null, rows); // Returns the rows (list of files) for the user
        }
    );
}

function getUserById(user_id, callback) {
    db.get('SELECT * FROM users WHERE id = ?', [user_id], (err, row) => {
        if (err) {
            console.error('Error fetching user by ID:', err);
            return callback(err, null);
        }
        callback(null, row);  // Return the user data if found
    });
}



module.exports = {
    start,
    getUserByEmail,
    insertUser,
    getUserIdByName,
    SaveFileInfo,
    GetUserFiles,
    getUserById
};
