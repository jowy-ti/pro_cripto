import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/`);
        return response;

        /*const products = [
            { productName: "Producto 1", price: 10.00 , image: "https://s1.elespanol.com/2021/12/02/actualidad/631699754_217099776_1024x576.jpg"},
            { productName: "Producto 2", price: 15.50 , image: "https://recetasdecocina.elmundo.es/wp-content/uploads/2024/03/pollo-frito-receta-1024x657.jpg"},
            { productName: "Producto 3", price: 20.99 , image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9N4mkRpQRNUQ3WU_9ka17Df258seMZ5shsw&s"},
            { productName: "Producto 4", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 5", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 6", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 7", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 8", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 9", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 10", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 11", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 12", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 13", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"},
            { productName: "Producto 14", price: 5.00 , image: "https://redburger.es/wp-content/uploads/2017/12/bocata-lomo-queso.jpg"}
        ];
        return products;*/

    } catch (error) {
        console.error("Error al obtener los productos");
        throw error;
    }
};

export const addProduct = async (product) => {
    try {
        const response = await axios.post(`${API_URL}/product`, product);
        return response.data;
    } catch (error) {
        console.error("Error al añadir el producto");
        throw error;
    }
};

export const deleteProduct = async (productName) => {
    try {
        await axios.delete(`${API_URL}/product/${productName}`);
    } catch (error) {
        console.error("Error al eliminar el producto");
        throw error;
    }
};

export const updateProduct = async (productNameBD, updatedProduct) => {
    try {
        const response = await axios.patch(`${API_URL}/product/${productNameBD}`, updatedProduct);
        return response.data;
    } catch (error) {
        console.error("Error al modificar el producto");
        throw error;
    }
}
