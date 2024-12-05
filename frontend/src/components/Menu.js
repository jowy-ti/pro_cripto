// components/Menu.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/Menu.css'; 


const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Menú desplegable */}
      <button className="button menu-button" onClick={toggleMenu}>
        Menú
      </button>
      {menuOpen && (
        <div className="menu-dropdown">
          <button className="button close-button-sp " onClick={toggleMenu}>
            Cerrar Menú
          </button>
          <ul>
            <li><Link to="/" className="menu-link">Página de inicio</Link></li>
            <li className="menu-separator">Plataforma de Comercio</li>
            <li><Link to="/shoppage" className="menu-link">Ir a la plataforma</Link></li>
            <li><Link to="/login" className="menu-link">Login de Administrador</Link></li>

            <li className="menu-separator">UPCoin</li>
            <li><Link to="/getstartedpage" className="menu-link">Empezar a utilizar UPCoin</Link></li>
            <li><Link to="/transfer-tokens" className="menu-link">Transferir UPC</Link></li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Menu;