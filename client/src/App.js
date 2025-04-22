// client/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';

// Define backend URL - Adjust if your backend runs elsewhere in production
const BACKEND_URL = 'http://localhost:5001'; // Your backend server address

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
    setError('');
    setDownloadUrl(''); // Reset download link when new file is selected
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    // Check file type (basic client-side check)
    const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Only .doc or .docx are allowed.');
        return;
    }


    setIsLoading(true);
    setMessage('');
    setError('');
    setDownloadUrl('');

    const formData = new FormData();
    // 'document' MUST match the key expected by multer on the backend
    formData.append('document', selectedFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setDownloadUrl(response.data.downloadUrl); // Get the download URL from backend

    } catch (err) {
      console.error("Upload/Conversion Error:", err);
      if (err.response) {
        // Request made and server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || 'An error occurred on the server.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('Could not connect to the server. Is it running?');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred.');
      }
      setMessage(''); // Clear success message on error
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header as="h2" className="text-center">Word to PDF Converter</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Upload Word Document (.doc, .docx)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={isLoading || !selectedFile}>
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        {' '} Converting...
                      </>
                    ) : (
                      'Convert to PDF'
                    )}
                  </Button>
                </div>
              </Form>

              {/* --- Feedback Area --- */}
              <div className="mt-4 text-center">
                {error && <Alert variant="danger">{error}</Alert>}
                {message && !error && <Alert variant="success">{message}</Alert>}

                {/* --- Download Link --- */}
                {downloadUrl && !error && (
                  <div className="mt-3 d-grid">
                    <Button
                      variant="success"
                      href={`<span class="math-inline">\{BACKEND\_URL\}</span>{downloadUrl}`} // Construct full download URL
                      target="_blank" // Open in new tab (optional)
                      rel="noopener noreferrer" // Security best practice
                      download // Suggests browser should download
                    >
                      Download PDF
                    </Button>
                    <small className="text-muted mt-1">
                        Note: Depending on your browser, you might need to right-click and "Save Link As..."
                     </small>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
          <p className="text-center text-muted mt-3">
            <small>Remember: Conversion relies on LibreOffice installed on the *server*. This may not work on all free hosting platforms.</small>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default App;