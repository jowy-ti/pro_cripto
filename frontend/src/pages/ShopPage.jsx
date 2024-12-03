import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Importa Link para la navegación
import ProductList from '../components/Products/ProductList';
import ProductsCarrito from '../components/Products/ProductCarrito';
import '../components/Styles/ShopPage.css';

const ShopPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [itemsCarrito, setItemsCarrito] = useState([]);
  const [showOption, setShowOption] = useState(true); // Para alternar entre productos y carrito
  const [messageCarrito, setMessageCarrito] = useState('');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
          <span className="subtitle">Tienda en línea</span>
        </h1>
        
        {/* Contenedor para los botones */}
        <div className="button-container-sp">
          <button className="button cart-button-sp" onClick={() => setShowOption(!showOption)}>
            Carrito
          </button>

          <button className="button menu-button-sp" onClick={toggleMenu}>
            Menú
          </button>
        </div>
      </header>

      {/* Menú desplegable (estilo oculto cuando menuOpen es false) */}
      {menuOpen && (
        <div className="menu-dropdown">
          <button className="button close-button-sp" onClick={toggleMenu}>
            Cerrar Menú
          </button>
          <ul>
            <li><Link to="/" className="menu-link">Pantalla de Inicio</Link></li>
            <li><Link to="/login" className="menu-link">Login de Administrador</Link></li>
            <li><Link to="/getstartedpage" className="menu-link">Empezar a utilizar UPCoin</Link></li>
            <li><Link to="/transfer-tokens" className="menu-link">Transferir UPC</Link></li>
          </ul>
        </div>
      )}

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


/*
import '../components/Styles/ShopPage.css';

const ShopPage = () => {
    const [itemsCarrito, setItemsCarrito] = useState([]);
    const [showOption, setShowOption] = useState(true);
    const [showButton, setShowButton] = useState(true);
    const [showContent, setShowContent] = useState(true);
    const [messageCarrito, setMessageCarrito] = useState('');

    

    const handleShow = () => {
        setShowOption(!showOption);
    }
    

    const handleAddToCarrito = (product, quantity) => {
        const existingProductIndex = itemsCarrito.findIndex(item => item.productName === product.productName);
        if (existingProductIndex !== -1) {
            [...itemsCarrito][existingProductIndex].quantity = quantity;
        } else {
            product.quantity = quantity;
        setItemsCarrito([...itemsCarrito, product]);
        }
        setMessageCarrito(`Producto: ${product.productName} añadido`);
        setShowContent(false);
        setTimeout(() => {setMessageCarrito(''); setShowContent(true);}, 1000);
        
    };

    const handleRemoveFromCarrito = (productName) => {
        setItemsCarrito(itemsCarrito.filter(product => product.productName !== productName));
        setShowContent(true);
    };

    const handleEmptyCarrito = () => {
        setItemsCarrito([]);
        //setMessageCarrito('Carrito vaciado');
        // setTimeout(() => {setMessageCarrito(''); setShowContent(true);}, 1000);
    }

    const handlePayment = () => {
        setShowButton(false);
    };

    const handleCancelPayment = () => {
        setShowButton(true);
    };

    return(
        <div className='content-container'>
            {messageCarrito && <div className='notification'>{messageCarrito}</div>}
            {showContent && (
                <div>
                    {showButton && (
                    <button className='button-top-right' onClick={handleShow}>{showOption ? 'Ver Carrito' : 'Ver Productos'}</button>
                    )}
                    {showOption && (
                    <ProductList onAddToCarrito={handleAddToCarrito}  itemsCarrito={itemsCarrito}/>
                    )}
                    {!showOption && (
                    <ProductsCarrito itemsCarrito={itemsCarrito} onRemoveFromCarrito={handleRemoveFromCarrito} 
                    onPayment={handlePayment} onCancelPayment={handleCancelPayment} onEmptyCarrito={handleEmptyCarrito}/>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopPage;
*/