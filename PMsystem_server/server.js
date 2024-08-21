const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Paths to data.json and upload.json files
const dataFilePath = path.join(__dirname, 'data.json');
const uploadFilePath = path.join(__dirname, 'upload.json');

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Ensure upload.json exists
if (!fs.existsSync(uploadFilePath)) {
    fs.writeFileSync(uploadFilePath, JSON.stringify({ data: [] }, null, 2));
}

// Set up multer for file upload handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        try {
            const database = JSON.parse(data);
            const user = database.user.find(
                (user) => user.username === username && user.password === password
            );

            if (user) {
                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ message: 'Server error' });
        }
    });
});

// Data retrieval route
app.get('/api/data', (req, res) => {
    fs.readFile(uploadFilePath, (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        try {
            const database = JSON.parse(data);
            res.json(database.data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ message: 'Server error' });
        }
    });
});

// Data submission route
app.post('/api/data', upload.single('file'), (req, res) => {
    const { name, comment, role } = req.body;
    const file = req.file;

    fs.readFile(uploadFilePath, (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        try {
            const database = JSON.parse(data);
            const newData = {
                id: Date.now(),
                name,
                comment,
                role,
                file: file ? file.filename : null,  // Use the filename here
            };
            database.data.push(newData);

            fs.writeFile(uploadFilePath, JSON.stringify(database, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to the file:', err);
                    return res.status(500).json({ message: 'Server error' });
                }

                res.status(201).json(newData);
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ message: 'Server error' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
