import React, { useState} from 'react';
import { Button, Modal } from 'antd';
import {FacebookOutlined, GoogleOutlined, LinkedinOutlined} from '@ant-design/icons';
import '../assets/style/login.css';

const AuthForm = () => {


  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [twofaCode, setTwofaCode] = useState('');


  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');


  const showModal = () => {
    setOpen(true);
  };
  
  
  const handleOk = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, password,twofaCode}),
      });
  
      if (response.ok) {
        const { success, twofa_enabled, token, user, message } = await response.json();
  
        if (success) {
          if (!twofa_enabled) {
            // L'utilisateur n'a pas activé le 2FA, afficher le modal pour le code 2FA
            console.log('Veuillez activer le 2FA');
            console.log('twofa_enabled:', twofa_enabled);
  
            // Assurez-vous que la fonction showModal est définie et fonctionne correctement
            showModal();
          } else {
            // Authentification réussie, créer et envoyer le token
            localStorage.setItem('token', token);
            localStorage.setItem('userId', user.id_user);
            localStorage.setItem('userName', user.nom);
            localStorage.setItem('Role', user.role);
            // 2FA est activé, procéder directement à l'accueil
            // Authentification réussie, rediriger l'utilisateur vers la page appropriée
            window.location.href = '/app';
            setNom('');
            setPassword('');
          }
        } else {
          // Échec de l'authentification
          if (message === 'Code 2FA incorrect') {
            // Gérer spécifiquement le cas d'un code 2FA incorrect
            console.log('Code 2FA incorrect');
            // Afficher un message à l'utilisateur ou prendre d'autres mesures nécessaires
          } else {
            alert(message || 'Erreur d\'authentification');
          }
        }
      } else {
        // Afficher un message d'erreur à l'utilisateur
        alert('Erreur d\'authentification');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //s'inscrire
  const handleSubsribe = async (e) => {
    e.preventDefault();

    const url = 'http://localhost:3000/api/users'; // Assurez-vous d'ajuster l'URL en fonction de votre configuration

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        // Réinitialisez les champs après le succès
        setFormData({
          nom: '',
          email: '',
          password: ''
        });

        // Gérer le succès (redirection, affichage du message de réussite, etc.)
      }
      else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        // Gérer l'erreur (affichage du message d'erreur, etc.)
      }
    } catch (error) {
      console.error('Error:', error);
      // Gérer les erreurs réseau ou d'autres problèmes
    }
  };

  //Login
  const handleLogin = async (event) => {
    event.preventDefault();
    if(nom=="" && password==""){
      alert('Veuillez compléter les champs! ')
    }else{
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nom, password, twofaCode}),
        });
    
        if (response.ok) {
          const { success, twofa_enabled, token, user } = await response.json();
    
          if (success) {
            if (!twofa_enabled) {
              // L'utilisateur n'a pas activé le 2FA, afficher le modal pour le code 2FA
              console.log('Veuillez activer le 2FA');
              console.log('twofa_enabled:', twofa_enabled);
    
              // Assurez-vous que la fonction showModal est définie et fonctionne correctement
              showModal();
            } else {
              // Authentification réussie, créer et envoyer le token
              localStorage.setItem('token', token);
              localStorage.setItem('userId', user.id_user);
              localStorage.setItem('userName', user.nom);
              localStorage.setItem('Role', user.role);
              // 2FA est activé, procéder directement à l'accueil
              // Authentification réussie, rediriger l'utilisateur vers la page appropriée
              window.location.href = '/app';
              setNom('');
              setPassword('');
            }
          } else {
            // Échec de l'authentification
            if (message === 'Code 2FA incorrect') {
              // Gérer spécifiquement le cas d'un code 2FA incorrect
              console.log('Code 2FA incorrect');
              // Afficher un message à l'utilisateur ou prendre d'autres mesures nécessaires
            } else {
              alert(message || 'Erreur d\'authentification');
            }
          }
        } else {
          // Afficher un message d'erreur à l'utilisateur
          alert('Erreur d\'authentification');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  
   
  };
  

  const [isSignIn, setIsSignIn] = useState(false);

  const handleToggleForm = () => {
    setIsSignIn((prevIsSignIn) => !prevIsSignIn);
  };

  return (
    <div>
      <div className={`container ${isSignIn ? 'right-panel-active' : ''}`} id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubsribe}>
            <h1>Inscription</h1>
            <div className="social-container">
              <a href="#" className="social"><FacebookOutlined style={{ fontSize: '18px', color: '#001529' }} /></a>
              <a href="#" className="social"><GoogleOutlined style={{ fontSize: '18px', color: '#001529' }} /></a>
              <a href="#" className="social"><LinkedinOutlined style={{ fontSize: '18px', color: '#001529' }} /></a>
            </div>
            <input
              type="text"
              placeholder="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit">S'inscrire</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Connexion</h1>
            <div className="social-container">
              <a href="#" className="social"><FacebookOutlined style={{ fontSize: '18px', color: '#001529' }} /></a>
              <a href="#" className="social"><GoogleOutlined style={{ fontSize: '18px', color: '#001529' }} /></a>
              <a href="#" className="social"><LinkedinOutlined style={{ fontSize: '18px', color: '#001529' }} /></a>
            </div>
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Se connecter</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className={`overlay-panel ${isSignIn ? 'overlay-left' : 'overlay-right'}`}>
              <h1>{isSignIn ? 'Bienvenue' : "Bonjour"}</h1>
              <p>{isSignIn ? 'Pour rester connecté(e) avec nous, veuillez vous connecter avec vos informations personnelles' : 'Entrez vos coordonnées personnelles'}</p>
              <button className="ghost" onClick={handleToggleForm}>
                {isSignIn ? "Se connecter" : "S'inscrire"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for 2FA code */}
      <Modal
        open={open}
        title="Enter Two-Factor Authentication Code"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        {/* Input field for entering 2FA code */}
        <input
          type="text"
          placeholder="Enter 2FA Code"
          value={twofaCode}
          onChange={(e) => setTwofaCode(e.target.value)}
        />
      </Modal>

    </div>
  );
};

export default AuthForm;
