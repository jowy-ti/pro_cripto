const {MongoClient} = require('mongodb');
const crypto = require('crypto');
const uri = 'mongodb://localhost:27017';
const dbName = 'Database';

const client = new MongoClient(uri);
let db; //Referencia a la BD

const usuariosStructure = {
    user: '',
    password: ''
};

const productosStructure = {
    productName: '',
    price: 0,
    imageURL: ''
}; 

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Conectado a la base de datos');
        db = client.db(dbName); //Crear referencia a la base de datos que nos conectamos
    } catch (error) {
        console.error('Error al conectar con la base de datos: ', error);
        throw error;
    }
}

async function initializeDatabase() {
    try {
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        if (collectionNames.includes('usuarios')) {
            await db.collection('usuarios').drop();
        }

        if (collectionNames.includes('productos')) {
            await db.collection('productos').drop();
        }

        await db.createCollection('usuarios');
        await db.createCollection('productos');

        //Llaves primarias
        await db.collection('usuarios').createIndex({user: 1}, {unique: true});
        await db.collection('productos').createIndex({productName: 1}, {unique:true});

        const salt = crypto.randomBytes(16).toString('hex');
        const password_admin = crypto.createHash("sha256").update("adm" + salt).digest("hex");
        await db.collection('usuarios').insertOne({...usuariosStructure, user:'adm', password:password_admin, salt: salt});


        console.log('Base de datos iniciada correctamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos: ', error);
        throw error;
    }
}

async function addUser(user, password, salt) {
    try {
        await db.collection('usuarios').insertOne({...usuariosStructure, user, password, salt});
        console.log('Usuario añadido correctamente');
    } catch (error) {
        console.error('Error al añadir el usuario a la base de datos: ', error);
        throw error;
    }
}

async function findUser(username) {  // Changed parameter to 'username'
    try {
        const userFound = await db.collection('usuarios').findOne({ user: username });
        if (!userFound) {
            console.log(`El usuario "${username}" no fue encontrado`);
            return null; 
        }
        console.log(`Usuario encontrado: `, userFound);
        return userFound; // Return the found user object
    } catch (error) {
        console.error('Error al buscar el usuario en la base de datos: ', error);
        throw error;
    }
}



//Por si acaso
async function deleteUser(user) {
    try {
        const result = await db.collection('usuarios').deleteOne({user});
        if (result.deletedCount === 0) {
            console.log('El usuario a eliminar no existe');
        } else {
            console.log('Usuario eliminado correctamente');
        }
    } catch (error) {
        console.error('Error al eliminar el usuario a la base de datos: ', error);
        throw error;
    }
}

async function addProduct(productName, price, imageURL) {
    try {
        await db.collection('productos').insertOne({...productosStructure, productName, price, imageURL});
        console.log('Producto añadido correctamente');
    } catch (error) {
        console.error('Error al añadir el producto a la base de datos: ', error);
        throw error;
    }
}

async function deleteProduct(productName) {
    try {
        const result = await db.collection('productos').deleteOne({productName});
        if (result.deletedCount === 0) {
            console.log('El producto a eliminar no existe');
        } else {
            console.log('Producto eliminado correctamente');
        }
    } catch (error) {
        console.error('Error al eliminar el producto a la base de datos: ', error);
        throw error;
    }
}

//Por si acaso
async function modifyProduct(productName, updatedFields) {
    try {
        const result = await db.collection('productos').updateOne({productName}, {$set: updatedFields});
        if (result.matchedCount === 0) {
            console.log('El producto a modificar no existe');
        } else if (result.modifiedCount === 0) {
            console.log('No se ha podido modificar el producto');
        } else {
            console.log('Producto modificado correctamente');
        }
    } catch (error) {
        console.error('Error al modificar el producto a la base de datos: ', error);
        throw error;
    }
}

async function getAllProducts() {
    try {
        const productos = await db.collection('productos').find({}).toArray();
        console.log('Productos leidos: ', productos);
        return productos;
    } catch (error) {
        console.error('Error al leer todos los productos', error);
        throw error;
    }
}

async function closeConnection() {
    try {
        await client.close();
        console.log('Conexion cerrada');
    } catch (error) {
        console.error('Error al cerrar la conexion con la base de datos: ', error);
        throw error;
    }
}

/* *************************Pruebas Operaciones**************************************** */

async function test() {
    try {
        //TEST: Conectar y inicializar BD
        await connectToDatabase();
        await initializeDatabase();

        //TEST: Añadir usuario, Añadir y modificar producto
        await addUser('user1', 'password1','d45051ff9f2585fa21d84eb440129656');
        await addProduct('product1', 111.11, 'url1');
        await addProduct('product2', 99.9, 'url2');
        await modifyProduct('product2', {price: 22.22, imageURL: 'url3'});

        //TEST: Obtener todos los productos
        const productos = await getAllProducts();
        console.log('Lista de productos: ', productos);

        //TEST: Borrar un usuario, Borrar un producto
        await deleteProduct('product1');
        await deleteUser('user1');
    } catch (error) {
        console.error('Error de los test: ', error);
    } finally {
        await closeConnection();
    }
}
module.exports = {connectToDatabase, initializeDatabase, addUser, addProduct, modifyProduct, getAllProducts, deleteProduct, deleteUser, closeConnection ,findUser};
/* ************************************************************************** */