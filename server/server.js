// server/server.js
require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // Use promise-based fs
const { convert } = require('libreoffice-convert');
const mongoose = require('mongoose');
const Conversion = require('./models/Conversion'); // Import the model

const app = express();
const port = process.env.PORT || 5001;

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
app.use(cors()); // Allow requests from frontend (running on a different port)
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- File Storage Setup (using Multer) ---
const uploadsDir = path.join(__dirname, 'uploads');
const convertedDir = path.join(__dirname, 'converted');

// Ensure directories exist
const ensureDirs = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(convertedDir, { recursive: true });
    console.log('Upload and Converted directories ensured.');
  } catch (err) {
    console.error("Error creating directories:", err);
  }
};
ensureDirs(); // Call it immediately

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Save uploaded files to 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Keep original filename + timestamp to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept only .doc and .docx files
        if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only Word documents (.doc, .docx) are allowed.'), false);
        }
    }
}).single('document'); // 'document' should match the field name in the frontend form

// --- API Endpoint for File Upload and Conversion ---
app.post('/api/upload', (req, res) => {
  upload(req, res, async (err) => {
    // Handle multer errors (like file type)
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      console.error('Unknown upload error:', err);
      return res.status(400).json({ message: err.message || 'An unknown error occurred during upload.' });
    }

    // If no file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    console.log('File uploaded:', req.file.filename);
    const inputPath = req.file.path;
    const outputFilename = `${path.parse(req.file.filename).name}.pdf`;
    const outputPath = path.join(convertedDir, outputFilename);
    const fileExtension = '.pdf'; // Desired output extension

    try {
      console.log(`Attempting conversion: ${inputPath} to ${outputPath}`);
      const docxBuf = await fs.readFile(inputPath);

      // Convert the buffer to PDF
      // IMPORTANT: libreoffice-convert requires LibreOffice to be installed!
      convert(docxBuf, fileExtension, undefined, async (err, pdfBuf) => {
        if (err) {
          console.error('LibreOffice conversion error:', err);
          // Cleanup uploaded file on conversion error
          try { await fs.unlink(inputPath); } catch (cleanupErr) { console.error("Error cleaning up uploaded file:", cleanupErr); }
          return res.status(500).json({ message: 'Error converting file. Is LibreOffice installed and accessible?' });
        }

        // Save the converted PDF file
        await fs.writeFile(outputPath, pdfBuf);
        console.log(`File converted successfully: ${outputPath}`);

        // --- Save conversion info to MongoDB ---
        try {
            const newConversion = new Conversion({
                originalFilename: req.file.originalname, // Store the user's original filename
                convertedFilename: outputFilename,       // Store the name of the PDF file on the server
                // uploadTimestamp is set by default
            });
            await newConversion.save();
            console.log('Conversion record saved to DB.');
        } catch (dbError) {
            console.error("Error saving conversion record to DB:", dbError);
            // Decide if you want to return an error here or just log it
        }

        // Send back the path or filename to download
         res.json({
           message: 'File converted successfully!',
           downloadUrl: `/api/download/${outputFilename}` // URL to download the file
         });

        // Optional: Clean up the original uploaded file after successful conversion
        // try { await fs.unlink(inputPath); } catch (cleanupErr) { console.error("Error cleaning up uploaded file:", cleanupErr); }
      });

    } catch (error) {
      console.error('Server error during conversion process:', error);
       // Cleanup uploaded file if something went wrong before conversion finished
      try { await fs.unlink(inputPath); } catch (cleanupErr) { console.error("Error cleaning up uploaded file:", cleanupErr); }
      res.status(500).json({ message: 'Server error during file conversion.' });
    }
  });
});

// --- API Endpoint for Downloading the Converted File ---
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(convertedDir, filename);

    // Basic security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
        return res.status(400).send('Invalid filename.');
    }

    res.download(filePath, (err) => {
        if (err) {
            console.error("Error downloading file:", err);
            if (err.code === 'ENOENT') {
                res.status(404).send('File not found.');
            } else {
                res.status(500).send('Could not download the file.');
            }
        } else {
            console.log(`File downloaded: ${filename}`);
            // Optional: Delete file after download? Depends on requirements.
            // fs.unlink(filePath).catch(err => console.error("Error deleting downloaded file:", err));
        }
    });
});


// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});