import React, { useState } from 'react';
import ProductList from '../components/Products/ProductList';
import ProductsCarrito from '../components/Products/ProductCarrito';
import '../components/Styles/ShopPage.css';

const ShopPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [itemsCarrito, setItemsCarrito] = useState([]);
  const [showOption, setShowOption] = useState(true); // Para alternar entre productos y carrito
  const [showButton, setShowButton] = useState(true);
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
    setShowButton(false);
  };

  const handleCancelPayment = () => {
    setShowButton(true);
  };

  return (
    <div className="shop-page-container">
      {/* Cabecera */}
      <header className="page-header-sp">
        <h1 className="page-header-title">
          UPCoin
          <span className="separator">|</span>
          <span className="subtitle">Portal de tiendas</span>
        </h1>
        
        {/* Contenedor para los botones */}
  <div className="button-container-sp">
    <button className="button cart-button-sp">
      Carrito
    </button>

    <button className="button menu-button-sp" onClick={toggleMenu}>
      Menú
    </button>
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
          {showButton && (
            <button className="button-top-right" onClick={() => setShowOption(!showOption)}>
              {showOption ? 'Ver Carrito' : 'Ver Productos'}
            </button>
          )}

          {showOption && (
            <ProductList onAddToCarrito={handleAddToCarrito} itemsCarrito={itemsCarrito} />
          )}

          {!showOption && (
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