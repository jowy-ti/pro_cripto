const API_URL = 'http://localhost:5000';//'http://localhost:8081'

export const getAllProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'GET',
        });
        //if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const responseJSON = await response.json();//.json()
        console.log(`Response status: ${response.status}, Data: ${responseJSON}`);
        return {status: response.status, data: responseJSON};
    } catch (error) {
        console.log('error');
        throw error;
    }

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
};

export const addProduct = async (product) => {
    try {
        const response = await fetch(`${API_URL}/addProduc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({productName: product.productName, price: product.price, image: product.imageURL}),
        });
        console.log(response.status);
        //if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const responseText = await response.text();//.json()
        console.log(`Response status: ${response.status}, Data: ${responseText}`);
        return {status: response.status, data: responseText};
    } catch (error) {
        console.log('error');
        throw error;
    }
};

export const deleteProduct = async (productName) => {
    try {
        const response = await fetch(`${API_URL}/product/${productName}`, {
            method: 'GET',
        });
        console.log(response.status);
        //if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const responseText = await response.text();//.json()
        console.log(`Response status: ${response.status}, Data: ${responseText}`);
        return {status: response.status, data: responseText};
    } catch (error) {
        console.log('error');
        throw error;
    }
};

export const updateProduct = async (productNameBD, updatedProduct) => {
    try {
        console.log('Entra');
        const response = await fetch(`${API_URL}/modifyProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({productNameBD, productName: updatedProduct.productName, price: updatedProduct.price, imageURL: updatedProduct.imageURL}),
        });
        console.log(response.status);
        //if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const responseText = await response.text();//.json()
        console.log(`Response status: ${response.status}, Data: ${responseText}`);
        return {status: response.status, data: responseText};
    } catch (error) {
        console.log('error');
        throw error;
    }
}
