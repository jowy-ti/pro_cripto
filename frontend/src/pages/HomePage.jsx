import React from "react";
import { useNavigate } from "react-router-dom"; 
import "../components/Styles/HomePage.css";
import logoUPC from "../assets/images/logo-upc.png";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* Imagen de cabecera con texto superpuesto */}
      <div className="header-image">
        <h1 className="header-title">UPCoin</h1>
        <p className="header-slogan">Una criptomoneda creada para la UPC, diseñada para la comunidad universitaria</p>

        {/* Contenedor de los botones dentro de la imagen */}
        <div className="button-container-home">
          <button className="nav-button-home" onClick={() => navigate("/shoppage")}>
            Ir a la tienda
          </button>
        </div>
      </div>

      {/* Nueva sección para la configuración del usuario */}
      <div className="user-setup">
        <h2 className="setup-title">¿Aún no has empezado a utilizar UPCoin?</h2>
        <p className="setup-description">
          Configura tu wallet y reclama tus primeros tokens UPC.  <br/> Es fácil, solo sigue los pasos en la sección de <br/> "Empezar a utilizar UPCoin" para comenzar.
        </p>
        <div className="button-container-setup">
          <button className="nav-button-setup" onClick={() => window.location.href = "/crypto-management"}>
            Empezar a utilizar UPCoin
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