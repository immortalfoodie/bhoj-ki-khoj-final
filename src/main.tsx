import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import 'leaflet/dist/leaflet.css';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

// Find the root element
const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

// Create a root and render the app
createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
