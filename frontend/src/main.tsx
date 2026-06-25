<<<<<<< HEAD
=======
/**
 * Main Entry Point
 * 
 * This is the root of the React application.
 * Sets up routing, context providers, and global styles.
 */

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
<<<<<<< HEAD
import { ThemeProvider } from './contexts/ThemeContext';
=======
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
<<<<<<< HEAD
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
=======
    <BrowserRouter 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  </React.StrictMode>
);


>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
