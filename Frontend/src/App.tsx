import { useState } from 'react';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setIsBackendHealthy(data.status === 'ok');
    } catch (error) {
      console.error('Backend health check failed:', error);
      setIsBackendHealthy(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Social Media Content Analyzer</h1>
        <p>Upload documents and extract text using AI-powered OCR and PDF parsing</p>
      </header>

      <main className="app-main">
        <FileUpload />
        
        <div className="health-check">
          <button onClick={checkBackendHealth} className="btn btn-primary">
            Check Backend Status
          </button>
          {isBackendHealthy !== null && (
            <div className={`status ${isBackendHealthy ? 'success' : 'error'}`}>
              {isBackendHealthy ? '✅ Backend is running' : '❌ Backend is offline'}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Ready for document upload and text extraction</p>
      </footer>
    </div>
  );
}

export default App;
