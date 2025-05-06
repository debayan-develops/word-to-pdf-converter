*Word to PDF Converter*    
 A full-stack web application designed for the seamless conversion of Microsoft Word documents (.docx) into PDF files.    
✨ Description    
This project offers a straightforward and efficient online solution for converting Word documents to PDF format. It features a user-friendly interface for uploading files and a robust backend powered by Node.js and Express.js that orchestrates the conversion process using the LibreOffice library. The application is built upon the MERN stack, showcasing a solid foundation in modern web development technologies and best practices.    
🚀 Features    
1.Effortless Uploads: Easily upload your .docx files through a clean and intuitive interface.    
2.Server-Side Conversion: Reliable document conversion handled efficiently on the server.    
3.Instant Downloads: Download your converted PDF file directly from the application.    
4.Simple User Experience: Designed for ease of use with a focus on a smooth conversion workflow.        

🛠️ Technologies Used    
Frontend:    

React: Building a dynamic, component-based, and responsive user interface.    

HTML5 & CSS3: Core web technologies for structuring and styling the application.    

Backend:    

Node.js & Express.js: Creating a scalable and efficient server-side application and RESTful API.    

MongoDB & Mongoose: Utilizing a NoSQL database for potential data storage (e.g., conversion logs) and an ODM for streamlined data interaction.    

libreoffice-convert: The primary library for executing the .docx to .pdf conversion.    

busboy: Handling multipart form data for robust file uploads.    

cors: Managing Cross-Origin Resource Sharing for secure communication between frontend and backend.

dotenv: Securely loading environment configuration variables.    

⚙️ Installation    
To get a local copy of this project up and running, follow these steps:    

Clone the repository:    

git clone https://github.com/debayan-develops/word-to-pdf-converter.git    
cd word-to-pdf-converter    

Set up the backend:    

cd server    
npm install    

Create a .env file in the server/ directory and add your MongoDB connection string and preferred port:    

MONGODB_URI=your_mongodb_connection_string    
PORT=5000 # Or any port you prefer    

Note: Ensure LibreOffice is installed on your operating system for the conversion functionality to work correctly.    

Set up the frontend:    

cd ../client    
npm install    

Create a .env file in the client/ directory to specify the backend API URL:    

REACT_APP_BACKEND_URL=http://localhost:5000 # Or your backend URL    

Start the backend server:    

cd ../server    
npm start    

Start the frontend development server:    

cd ../client    
npm start    

The application should now be accessible in your web browser at http://localhost:3000 (or the port configured for the client).    
