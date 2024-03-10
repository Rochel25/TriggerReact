import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/Login';
import Page from './components/Menu';

const isAuthenticated = () => {
  // Mettez en œuvre la logique d'authentification ici, par exemple, vérifier si l'utilisateur est connecté.
  // Retourne true si l'utilisateur est authentifié, sinon false.
  // Exemple simple:
  return localStorage.getItem('token') !== null;
};

const PrivateRoute = ({ element, path }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/" state={{ from: path }} replace />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/app" element={<PrivateRoute element={<Page />} path="/app"  />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
