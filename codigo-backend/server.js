const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require('body-parser');

//express-rate-limit permite limitar en número de POST que se hacen a la página de inicio de sesión, así se evitan ataques de fuerza bruta
const rateLimit = require('express-rate-limit');

//helmet permite dejar de enviar el campo X-Powered-By a las respuestas HTTP, este puede ser usado para vulnerar la web
const helmet = require('helmet');
require('dotenv').config();
const crypto = require('crypto');

//express-mongo-sanitize permite hacer una sanitazión de los inputs del usuario en busca de inyecciones NOSQL
const expressMongoSanitize = require ("express-mongo-sanitize");

//XSS clean permite hacer una sanitazión de los inputs del usuario en busca de inyecciones XSS
const xss = require('xss-clean');

const app = express();
app.use(bodyParser.json());
const cookieParser = require('cookie-parser');
const mongo_functions = require("./MongoDB.js");
const {Web3} = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));
app.use(helmet());

//Configurar CORS con la IP indicada para evitar problemas con los orígenes
app.use(cors({
  origin: 'http://10.4.41.37:8080',
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


//Configuración de la cookie
//Cambiar secure a true en caso que se quiera usar HTTPS 
//La cookie es válida durante 1 día
//Campo httpOnly para evitar que se pueda acceder a la cookie des de codigos JS en el navegador
app.use(
    session({
        secret: '123456789',
        resave: false,
        name: 'cookie',
        saveUninitialized: false,
        cookie: {
            httpOnly: true, 
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);
app.use(xss());
app.use(expressMongoSanitize());



app.set('trust proxy', 1);


//Limitar el número de requisitos de una IP orígen
//El máximo son 60 en 5 minutos 
const loginRateLimiter = rateLimit({
    windowMs: 60*1000*5,
    max: 60,
    message: "Too many login attempts",
    stardardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => req.ip
});


app.post("/login", loginRateLimiter, async (req, res) => {
    const user = req.body.userName;
    const password = req.body.password;

    if (user && password) {
        const user_profile = await mongo_functions.findUser(user);
        //Si el usuario no existe
        if (user_profile == null){
            return res.status(400).send('Invalid username or password');
        };

        //Calcular el hash a través del salt de la base de datos y el input del usuaio
        const salt = user_profile.salt;
        const password_hashed = crypto.createHash("sha256").update(password + salt).digest("hex");
        
        if (password_hashed != user_profile.password){
            return res.status(400).send('Invalid username or password');
        };

        //Enviar cookies con rol Administrador 
        req.session.role = "Admin";
        req.session.loggedIn = true
        req.session.user = req.body.userName;
        res.cookie('session_id', req.sessionID, { 
            httpOnly: true, 
            secure: false,
            sameSite: 'None',
            maxAge: 1000 * 60 * 60 * 24, 
        });
        console.log(req.session)
        return res.status(200).send('Login successful');
    }
    return res.status(400).send('Invalid username or password');
});


app.post('/logout', (req, res) => {

    //Destruir la cookie que ha passado el usuaio como input
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.clearCookie('session_id', {
            httpOnly: true, 
            secure: false, 
            sameSite: 'None'
        });
        res.status(200).send('Logged out successfully');
    });
});


app.post("/register", async(req, res) => {
    //if (req.session && req.session.loggedIn){
        const user = req.body.userName;
        const password = req.body.password;
        if (user && password){
            const user_profile = await mongo_functions.findUser(user);
            //Si se encuentra el usuario en la base de dados este ya existe
            if (user_profile != null){
                return res.status(400).send('Username already exists');
            };

            //Calcular el hash a partir de la contraseña y un hash aleatorio
            const salt = crypto.randomBytes(16).toString('hex');
            const password_hashed = crypto.createHash("sha256").update(password + salt).digest("hex");

            //añadir en nuevo usuario
            mongo_functions.addUser(user, password_hashed, salt);


            req.session.user = user;
            req.session.role = "Admin";

            res.cookie('session_id', req.sessionID, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24,
            });
            res.status(200).send("User added");
        }
        else res.status(400).send("Invalid username or password")
    //}
})

app.get("/register", async(req, res) => {
    //Si tiene una cookie
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})


app.get("/productmanagement", async(req, res) => {
  //Si tiene una cookie
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})

app.get("/addproduct", async(req, res) => {
  //Si tiene una cookie
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})

app.get("/deleteproduct", async(req, res) => {
  //Si tiene una cookie
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})

app.get("/modifyproduct", async(req, res) => {
  //Si tiene una cookie
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})

//se crea el servidor en el puerto 5000
app.listen(5000, () => {
    console.log("Server started on port 5000");
});


app.get("/", async(req, res)  => {
  //Se llama a la base de datos en busca de todos los productos
    const products = await mongo_functions.getAllProducts();
    //Se devuelven los productos en formato json
    res.json(products)
});

(async () => {
    try {
        //Se conecta a la base de datos y se inicializa
        await mongo_functions.connectToDatabase();
        await mongo_functions.initializeDatabase();
        console.log('Database connected and initialitzated successfully');
    } catch (error) {
        console.error('Database connection or initialization failed:', error);
    }
})();


app.get("/dashboard", async(req,res) =>{
  //Si tiene una cookie
    if (req.session && req.session.loggedIn)
        return res.status(200).send("");
    else 
    return res.status(401).send("Not authenticated")
});

app.post("/addProduct", async(req,res) =>{
    const productName = req.body.productName;
    const price = req.body.price;
    const image = req.body.image;
    //Solo en caso que se hayan pasado las 3 características
    if (productName && price && image){
        const product_exists = await mongo_functions.findProduct(productName);
        //Si el producto ya existe en la base de datos
        if (product_exists != null){
            return res.status(400).send("Product already exists");
        }
        //Se añade el producto a la base de datos
        mongo_functions.addProduct(productName, price, image);
        res.status(200).send("Product added");
    }
    else res.status(400).send("Invalid name, price or image");

});

app.post("/deleteProduct", async(req,res) =>{
    const productName = req.body.product;
    if (productName){
        const product_exists = await mongo_functions.findProduct(productName);
        //Si el producto no existe
        if (product_exists != null){ // C
            return res.status(400).send("Product already exists");
        }
        //Si el producto existe se borra de la base de datos
        mongo_functions.deleteProduct(productName);
        res.status(200).send("Product deleted");
    }
    else res.status(400).send("Invalid name");

});

app.post("/modifyProduct", async(req,res) =>{
    const productName = req.body.productName;
    const price = req.body.price;
    const image = req.body.image;

    console.log ("productName: ", productName);
    console.log ("price: ", price);
    console.log ("image: ", image);
    //Si se indica el nombre del producto y el nuevo precio o la nueva imagen
    if (productName && (price || image)){
        const product_exists = await mongo_functions.findProduct(productName);
        //si el producto no existe
        if (product_exists == null){
            return res.status(400).send("Product doesn't exists");
        }
        //Si solo se quiere cambiar el precio
        if (price && !image){
            const imageURL = product_exists.imageURL;
            //Llamadoa con nuevo precio, imagen antigua
            await mongo_functions.modifyProduct(productName, {price, imageURL})
        }
        //Si solo se quiere cambiar la imagen
        if (image && !price){
            const price_BD = product_exists.price;
            //Llamada con nueva imagen, precio antiguo
            await mongo_functions.modifyProduct(productName, {price_BD, image})
        }
        //Si se quiere cambiar el precio y la imagen
        else {
            //Llamada con nueva imagen y nuevo precio
            await mongo_functions.modifyProduct(productName, {price, image})
        }
        res.status(200).send("Product modified");
    }
    else res.status(400).send("Invalid name, price or image");
});




/************************* UPCOIN *************************/

const upcoinABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_relayer",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "claimTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "relayer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "transferWithSignature",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
const upcoinContract = new web3.eth.Contract(upcoinABI, process.env.UPCOIN_DEPLOY_ADDRESS);

// Endpoint para realizar la transferencia con verificación de firma
app.post('/relay-transfer', async (req, res) => {
    const { from, to, amount, signature } = req.body;
    console.log("Datos recibidos:", req.body);
  
    try {
        // Obtener el precio de gas dinámico
        const gasPrice = await web3.eth.getGasPrice();
        console.log("Gas Price obtenido:", gasPrice);
  
        // Estimar el gas necesario
        const gasEstimate = await upcoinContract.methods
            .transferWithSignature(from, to, amount, signature)
            .estimateGas({ from: process.env.RELAYER_ADDRESS });
        console.log("Estimación de Gas:", gasEstimate);
  
        // Obtener el número de nonce
        const nonce = await web3.eth.getTransactionCount(process.env.RELAYER_ADDRESS);
  
        // Obtener información del bloque más reciente para calcular las tarifas base
        const block = await web3.eth.getBlock("latest");
        const baseFee = parseInt(block.baseFeePerGas);
  
        const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei'); // 2 gwei
        const maxFeePerGas = baseFee + parseInt(maxPriorityFeePerGas);
  
        // Preparar los datos de la transacción
        const txData = {
            from: process.env.RELAYER_ADDRESS,
            to: process.env.UPCOIN_DEPLOY_ADDRESS,
            data: upcoinContract.methods
                .transferWithSignature(from, to, amount, signature)
                .encodeABI(),
            gas: gasEstimate.toString(),
            maxFeePerGas: maxFeePerGas.toString(),
            maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
            nonce,
        };
  
        console.log("Datos de la transacción:", txData);
  
        // Firmar la transacción con la clave privada del Relayer
        const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.RELAYER_PRIVATE_KEY);
        console.log("Transacción firmada");
  
        // Enviar la transacción firmada
        const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transacción enviada:", tx);
  
        // Responder con los detalles de la transacción
        res.json({
            message: 'Transferencia realizada con éxito',
            tx: {
                blockHash: tx.blockHash,
                blockNumber: tx.blockNumber.toString(),
                cumulativeGasUsed: tx.cumulativeGasUsed.toString(),
                effectiveGasPrice: tx.effectiveGasPrice.toString(),
                from: tx.from,
                gasUsed: tx.gasUsed.toString(),
                logs: tx.logs.map(log => ({
                    ...log,
                    blockNumber: log.blockNumber.toString(),
                    logIndex: log.logIndex.toString(),
                    transactionIndex: log.transactionIndex.toString(),
                })),
                logsBloom: tx.logsBloom,
                status: tx.status.toString(),
                to: tx.to,
                transactionHash: tx.transactionHash,
                transactionIndex: tx.transactionIndex.toString(),
                type: tx.type.toString(),
            },
        });
  
    } catch (error) {
        console.error("Error en la transferencia:", error);
        res.status(500).json({ error: 'Error en la transferencia' });
    }
  });

// Endpoint para reclamar los tokens iniciales
app.post('/claim-tokens', async (req, res) => {
    const { userWallet } = req.body;
  
    console.log("(ct) userWallet : " + userWallet);
  
    try {
      // Obtener el nonce para la transacción
      const nonce = await web3.eth.getTransactionCount(process.env.RELAYER_ADDRESS);
  
      console.log("nonce obtenido:", nonce);
  
      // Estimar el gas necesario para la transacción
      const gasEstimate = await upcoinContract.methods.claimTokens(userWallet).estimateGas({ from: process.env.RELAYER_ADDRESS});
  
      const block = await web3.eth.getBlock("latest");
      const baseFee = parseInt(block.baseFeePerGas); // Tarifa base actual
  
      // Ajustar valores dinámicamente
      const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei'); // 2 gwei
      const maxFeePerGas = baseFee + parseInt(maxPriorityFeePerGas);
  
      // Construir los datos de la transacción
      const txData = {
        from: process.env.RELAYER_ADDRESS, // Dirección del relayer
        to: process.env.UPCOIN_DEPLOY_ADDRESS,
        data: upcoinContract.methods.claimTokens(userWallet).encodeABI(),
        gas: gasEstimate.toString(), // Convertir gas a cadena
        //gasPrice: (await web3.eth.getGasPrice()).toString(), // Convertir gasPrice a cadena
        nonce: nonce,
        maxFeePerGas: maxFeePerGas.toString(), // Máximo calculado dinámicamente
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(), // Incentivo ajustado
        
      };
  
      console.log("txData construido:", txData);
  
      // Firmar la transacción con la clave privada del Relayer
      const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.RELAYER_PRIVATE_KEY);
  
      console.log("Transacción firmada");
  
      // Enviar la transacción firmada
      const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
      console.log("Transacción enviada:", tx);
  
      // Responder al cliente con los detalles de la transacción
      res.json({
        message: 'Tokens reclamados correctamente',
        tx: {
          blockHash: tx.blockHash,
          blockNumber: tx.blockNumber.toString(),
          cumulativeGasUsed: tx.cumulativeGasUsed.toString(),
          effectiveGasPrice: tx.effectiveGasPrice.toString(),
          from: tx.from,
          gasUsed: tx.gasUsed.toString(),
          logs: tx.logs.map(log => ({
            ...log,
            blockNumber: log.blockNumber.toString(),
            logIndex: log.logIndex.toString(),
            transactionIndex: log.transactionIndex.toString(),
          })),
          logsBloom: tx.logsBloom,
          status: tx.status.toString(),
          to: tx.to,
          transactionHash: tx.transactionHash,
          transactionIndex: tx.transactionIndex.toString(),
          type: tx.type.toString(),
        },
      });
    } catch (error) {
      console.error("Error al reclamar tokens:", error);
      // Identificar si el error es porque ya se reclamaron los tokens
      const isTokensAlreadyClaimedError =
      error.cause &&
      error.cause.message &&
      error.cause.message.includes("Tokens already claimed by this address");

        if (isTokensAlreadyClaimedError) {
            res.status(400).json({ error: 'Los tokens ya fueron reclamados por esta dirección' });
        } else {
            res.status(500).json({ error: 'Error al reclamar los tokens' });
        }
    }
  });
