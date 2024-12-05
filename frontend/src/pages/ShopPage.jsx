import React, { useState } from 'react';
import ProductList from '../components/Products/ProductList';
import ProductsCarrito from '../components/Products/ProductCarrito';
import '../components/Styles/ShopPage.css';
import Menu from '../components/Menu';

const ShopPage = () => {
  const [itemsCarrito, setItemsCarrito] = useState([]);
  const [showOption, setShowOption] = useState(true); // Para alternar entre productos y carrito
  const [messageCarrito, setMessageCarrito] = useState('');


  const handleAddToCarrito = (product, quantity) => {
    const existingProductIndex = itemsCarrito.findIndex(item => item.productName === product.productName);
    if (existingProductIndex !== -1) {
      [...itemsCarrito][existingProductIndex].quantity = quantity;
    } else {
      product.quantity = quantity;
      setItemsCarrito([...itemsCarrito, product]);
    }
    setMessageCarrito(`Producto: ${product.productName} añadido`);
    setTimeout(() => {
      setMessageCarrito('');
    }, 1000);
  };

  const handleRemoveFromCarrito = (productName) => {
    setItemsCarrito(itemsCarrito.filter(product => product.productName !== productName));
  };

  const handleEmptyCarrito = () => {
    setItemsCarrito([]);
  };

  const handlePayment = () => {
    setShowOption(false); // Cambiar a la vista de pago
  };

  const handleCancelPayment = () => {
    setShowOption(true); // Volver a la vista de productos
  };

  return (
    <div className="shop-page-container">
      {/* Cabecera */}
      <header className="page-header-sp">
        <h1 className="page-header-title">
          <span className="logo"></span>
          UPCoin
          <span className="separator">|</span>
          <span className="subtitle">Plataforma de comercio</span>
        </h1>
        
        {/* Contenedor para los botones */}
        <div className="button-container-sp">
          <button className="button cart-button-sp" onClick={() => setShowOption(!showOption)}>
            {showOption ? "Ver Carrito" : "Ver Productos"} {/* Cambia el texto del botón */}
          </button>
          <Menu />
        </div>
      </header>

      {/* Imagen de cabecera */}
      <div className="header-image-pt">
        {/* Mensaje de presentación */}
        <div className="intro-text">
          <p className="intro-title-NC">UPCshop</p>
          <p className="intro-subtitle">Un vistazo a lo mejor del merchandising UPC</p>
        </div>
      </div>

      {/* Mostrar productos debajo de la imagen */}
      <div className="product-section">
        {messageCarrito && <div className="notification">{messageCarrito}</div>}
        <div>
          {showOption ? (
            <ProductList onAddToCarrito={handleAddToCarrito} itemsCarrito={itemsCarrito} />
          ) : (
            <ProductsCarrito
              itemsCarrito={itemsCarrito}
              onRemoveFromCarrito={handleRemoveFromCarrito}
              onPayment={handlePayment}
              onCancelPayment={handleCancelPayment}
              onEmptyCarrito={handleEmptyCarrito}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;