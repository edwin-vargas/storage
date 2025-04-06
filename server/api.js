const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('fs');
const multer = require('multer');

const db = require('./db');
const command = require('./command.js');

const app = express();
const PORT = 3000;

app.disable('x-powered-by')
app.use(cors());
app.use(express.json());
db.start();
const publicDirectoryPath = path.join(__dirname, '..', 'client')
// const publicDirectoryPath = path.join(__dirname, 'templates')
app.use(express.static(publicDirectoryPath))
app.use(cors({
	origin: (origin, callback) => {
		const ACCEPTED_ORIGINS = [
			'http://localhost:3000',
			'http://127.0.0.1:3000'
		]

		if (ACCEPTED_ORIGINS.includes(origin)) {
			return callback(null, true)
		}

		if (!origin) {
			return callback(null, true)
		}

		return callback(new Error('Not allowed by CORS'))
	}
}))

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
			const dir = req.body.name

			// Check if the directory exists
			if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
					console.log(`Directory created: ${dir}`);
			} else {
					console.log('Directory already exists');
			}

			cb(null, dir);  // Store the file in the directory
	},
	filename: function (req, file, cb) {
			cb(null, file.originalname); // Save the file with its original name
	}
});

const upload = multer({ storage: storage });
//----------------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "sing_in.html"));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.getUserByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ message: 'DB Error' });

        if (!user) return res.status(401).json({ message: 'User not found' });

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.status(200).json({
            message: '✅ Login successful',
            user: {
                id: user.id,
                email: user.email,
				name: user.name
            }
        });
    });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    db.insertUser(name, email, password, function (err) {
        if (err) return res.status(500).json({ message: 'DB Error' });

				command.run("npx", ["wrangler", "r2", "bucket", "create", name]);

        res.json({ user: name });
    });
});

app.post('/file', upload.single('file'), (req, res) => {
	const name = req.body.name;
	const fileName = req.file.originalname;
	const filePath = path.join(name, fileName);
	const filePathParam = `--file=${path.join(__dirname, filePath)}`;

	
	command.run("npx", ["wrangler", "r2", "object", "put", filePath, filePathParam, "--remote"]);

	// Then get user ID and save file info
	db.getUserIdByName(name, (err, userId) => {
		if (err) {
			return res.status(500).json({ message: 'Error retrieving user ID' });
		}

		if (!userId) {
			return res.status(404).json({ message: 'User not found' });
		}

		db.SaveFileInfo(fileName, userId, (err) => {
			if (err) {
				return res.status(500).json({ message: 'Error saving file info' });
			}

			// ✅ Only send response once, after everything is done
			res.json({ message: '✅ File uploaded successfully', filePath: filePath });
		});
	});
});

app.get('/files', (req, res) => {
    const { name } = req.query;  // Assuming the user sends their name as a query parameter (e.g., /files?name=JohnDoe)
    
    if (!name) {
        return res.status(400).json({ message: 'User name is required' });
    }

    // Get the user ID based on the name
    db.getUserIdByName(name, (err, userId) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving user ID' });
        }

        if (!userId) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the files for the user
        db.GetUserFiles(userId, (err, files) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving user files' });
            }

            if (files.length === 0) {
                return res.status(404).json({ message: 'No files found for this user' });
            }

            // Respond with the list of files
            res.json({ files });
        });
    });
});

app.get('/file', (req, res) => {
    const { user_id, fileName } = req.query;  // Get the user_id from the query parameter

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    db.getUserById(user_id, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving user data' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const userName = user.name;
		const fileLocation = path.join(userName, fileName)
		const workingDir = path.join(__dirname, userName)

		command.runD(
			'npx', 
			['wrangler', 'r2', 'object', 'get', fileLocation, '--remote'],
			workingDir
		)
		filePath = path.join(__dirname, userName, fileName)
		res.sendFile(filePath, (err) => {
			if (err) {
				return res.status(500).json({ message: 'Error sending the file' });
			}
		});
    });
});



app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
