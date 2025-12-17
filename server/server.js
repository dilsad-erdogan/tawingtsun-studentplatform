require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());

// Routes
const uploadRoute = require('./routes/upload');
app.use('/api/upload', uploadRoute);

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists (Double check on startup)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve Frontend (dist folder)
const frontendPath = path.join(__dirname, '../dist');

if (fs.existsSync(frontendPath)) {
    // Serve static files
    app.use(express.static(frontendPath));

    // Handle React Routing (SPA) - Send index.html for all other routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('File Upload Server Running. (Frontend build not found)');
    });
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
