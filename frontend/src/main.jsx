import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initMobileApp } from './utils/mobileInit'

// Initialize mobile listeners and API interceptors
initMobileApp()

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
