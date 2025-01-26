import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add custom fonts and meta tags dynamically
const addFontsAndMetaTags = () => {
  // Add Inter and Fira Code fonts from Google Fonts
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Fira+Code:wght@400;500&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  // Add meta tags for better SEO and responsiveness
  const metaCharset = document.createElement('meta');
  metaCharset.setAttribute('charset', 'UTF-8');
  document.head.appendChild(metaCharset);

  const metaViewport = document.createElement('meta');
  metaViewport.setAttribute('name', 'viewport');
  metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
  document.head.appendChild(metaViewport);

  const metaDescription = document.createElement('meta');
  metaDescription.setAttribute('name', 'description');
  metaDescription.setAttribute('content', 'A modern and stylish React application.');
  document.head.appendChild(metaDescription);
};

// Add a loading animation while the app is being rendered
const addLoadingAnimation = () => {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '0';
  loadingDiv.style.left = '0';
  loadingDiv.style.width = '100%';
  loadingDiv.style.height = '100%';
  loadingDiv.style.backgroundColor = '#1e1e2f';
  loadingDiv.style.display = 'flex';
  loadingDiv.style.justifyContent = 'center';
  loadingDiv.style.alignItems = 'center';
  loadingDiv.style.zIndex = '1000';
  loadingDiv.innerHTML = `
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loader {
        border: 4px solid #6e8efb;
        border-top: 4px solid transparent;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      }
    </style>
    <div class="loader"></div>
  `;
  document.body.appendChild(loadingDiv);
};

// Remove the loading animation once the app is rendered
const removeLoadingAnimation = () => {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.remove();
  }
};

// Add fonts, meta tags, and loading animation
addFontsAndMetaTags();
addLoadingAnimation();

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove the loading animation after the app is rendered
removeLoadingAnimation();