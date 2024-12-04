
import React from 'react';
import { useNavigate } from "react-router-dom";
import Menu from '../components/Menu';  // Importa el componente del menú
import "../components/Styles/HomePage.css";
import logoUPC from "../assets/images/logo-upc.png";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* Cabecera de página */}
      <header className="page-header">
          <h1 className="page-header-title">
            <span className="logo"></span>
            UPCoin
            <span className="separator">|</span>
            <span className="subtitle">Página de Inicio</span>
          </h1>
          {/* Usar el componente Menu */}
            <Menu />
      </header>

      {/* Imagen de cabecera */}
      <div className="header-image-hp">
        {/* Mensaje de bienvenida */}
        <span className="logo-hp"></span>
        <div className="intro-text-hp">
          <p className="intro-title-hp">Hola UPCoin</p>
          <p className="intro-subtitle-hp">La Nueva Criptomoneda de la UPC</p>
          <p className="intro-description-hp">
            UPCoin es una criptomoneda basada en el estándar ERC20, diseñada para transformar la economía de la UPC. 
            Con un contrato inteligente desplegado en la testnet de Sepolia, UPCoin permite a estudiantes, profesores 
            y personal realizar pagos y transacciones de forma rápida, segura y eficiente dentro del entorno académico. 
            Únete a la revolución digital y empieza a disfrutar de los beneficios de UPCoin.
          </p>
        </div>
      </div>

      {/* Nueva sección para la configuración del usuario*/}
      <div className="user-setup">
        <h2 className="setup-title">¿Aún no has empezado a utilizar UPCoin?</h2>
        <p className="setup-description">
          Configura tu wallet y reclama tus primeros tokens UPC.  <br/> Es fácil, solo sigue los pasos en la sección de <br/> "Empezar a utilizar UPCoin" para comenzar.
        </p>
        <div className="button-container-setup">
          <button className="nav-button-setup" onClick={() => window.location.href = "/getstartedpage"}>
            Empezar a utilizar UPCoin
          </button>
        </div>
      </div>

      {/* Imagen de plataforma de comercio*/}
      <div className="image-hp-pc">
        {/* Mensaje de bienvenida */}
        <div className="pc-text-hp">
          <p className="pc-title-hp">Plataforma de comercio UPCoin</p>
          <p className="pc-subtitle-hp">Un marketplace único para la comunidad UPC</p>
          <p className="pc-description-hp">
          Explora una amplia variedad de productos y servicios ofrecidos por diferentes comercios. 
          Realiza tus compras de forma segura y rápida utilizando UPCoin, la criptomoneda que impulsa nuestra economía.
          </p>
        </div>

        {/* Contenedor de los botones dentro de la imagen*/}
        <div className="button-container-pc">
          <button className="nav-button-pc" onClick={() => navigate("/shoppage")}>
            Ir a la plataforma de comercio
          </button>
        </div>
      </div>

      {/* Pie de página */}
      <footer className="footer">
        <div className="footer-column">
          <p>Proyecto de Tecnologías de la Información</p>
          <p>Criptomoneda Universitaria UPCoin</p>
        </div>
        <div className="footer-column">
          <p>Joel Gonzalez Jimenez</p>
          <p>Sebastian Morante Bonilla</p>
        </div>
        <div className="footer-column">
          <p>Sergio Jarque Salzedo</p>
          <p>Xavier Lopez Manes</p>
        </div>
        <div className="footer-column footer-right">
          <img src={logoUPC} alt="Logo de la UPC" className="logo-upc" />
        </div>
      </footer>
    </div>
  );

};
export default HomePage;