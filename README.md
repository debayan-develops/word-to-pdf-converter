Word to PDF ConverterA full-stack web application to easily convert Microsoft Word documents (.docx) into PDF files.DescriptionThis project provides a simple and efficient online tool for converting Word documents to PDFs. It features a clean user interface for uploading files and a robust backend that handles the conversion process using LibreOffice. The application is built using the MERN stack, demonstrating proficiency in modern web development technologies and practices.FeaturesUpload Word documents (.docx) for conversion.Convert documents server-side using a reliable conversion library.Download the converted PDF file.Simple and intuitive user interface.Technologies UsedFrontend:React: For building a dynamic and responsive user interface.HTML, CSS: Standard web technologies for structure and styling.Backend:Node.js: JavaScript runtime environment.Express.js: Web application framework for building the API.MongoDB: NoSQL database (potentially used for logging or metadata, as indicated by models/Conversion.js).Mongoose: MongoDB object data modeling for Node.js.libreoffice-convert: Library used to perform the actual document conversion.busboy: For handling multipart form data, specifically file uploads.cors: Middleware to enable Cross-Origin Resource Sharing.dotenv: For loading environment variables from a .env file.InstallationTo run this project locally, follow these steps:Clone the repository:git clone https://github.com/debayan-develops/word-to-pdf-converter.git
cd word-to-pdf-converter
Set up the backend:cd server
npm install
Create a .env file in the server/ directory and add your MongoDB connection string and any other necessary environment variables:MONGODB_URI=your_mongodb_connection_string
PORT=5000 # Or any port you prefer
Note: Ensure LibreOffice is installed on your system for the conversion to work.Set up the frontend:cd ../client
npm install
Create a .env file in the client/ directory if needed, for example, to specify the backend URL:REACT_APP_BACKEND_URL=http://localhost:5000 # Or your backend URL
Start the backend server:cd ../server
npm start
Start the frontend development server:cd ../client
npm start
The application should now be running on http://localhost:3000 (or the port specified in your client environment).UsageNavigate to the application in your web browser.Click the upload area or button to select a Word document (.docx).Wait for the conversion process to complete.Once converted, a download link or button will appear to get your PDF file.Project Structureword-to-pdf-converter/
├── client/         # Frontend React application
│   ├── public/
│   ├── src/
│   └── package.json
└── server/         # Backend Node.js/Express application
    ├── converted/  # Directory where converted files might be stored temporarily
    ├── models/     # Mongoose models (e.g., Conversion.js)
    ├── node_modules/
    ├── .env        # Environment variables
    ├── server.js   # Main server file
    └── package.json
ContributingContributions are welcome! Please feel free to submit a Pull Request or open an Issue for any bugs or feature requests.License[Specify your license here, e.g., MIT]
