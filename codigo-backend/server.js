const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();
const crypto = require('crypto');
const expressMongoSanitize = require ("express-mongo-sanitize");
const xss = require('xss-clean');

const app = express();
app.use(bodyParser.json());
const cookieParser = require('cookie-parser');
const mongo_functions = require("./MongoDB.js");
const {Web3} = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));
app.use(helmet());
app.use(cors({
  origin: 'http://10.4.41.37:8080',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: '123456789',
        resave: false,
        name: 'cookie',
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);
app.use(xss());
app.use(expressMongoSanitize());



app.set('trust proxy', 1);

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
        if (user_profile == null){
            return res.status(400).send('Invalid username or password');
        };
        const salt = user_profile.salt;
        const password_hashed = crypto.createHash("sha256").update(password + salt).digest("hex");
        
        if (password_hashed != user_profile.password){
            return res.status(400).send('Invalid username or password');
        };
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
            if (user_profile != null){
                return res.status(400).send('Username already exists');
            };
            const salt = crypto.randomBytes(16).toString('hex');
            const password_hashed = crypto.createHash("sha256").update(password + salt).digest("hex");
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
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})


app.get("/productmanagement", async(req, res) => {
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})

app.get("/addproduct", async(req, res) => {
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})

app.get("/deleteproduct", async(req, res) => {
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})

app.get("/modifyproduct", async(req, res) => {
    if (req.session && req.session.loggedIn){
        return   res.status(200).send("User added");
    }
    else{
        res.status(400).send("Invalid username or password")
    } 
})

app.listen(5000, () => {
    console.log("Server started on port 5000");
});

app.get("/", async(req, res)  => {
    const products = await mongo_functions.getAllProducts();
    res.json(products)
});

(async () => {
    try {
        await mongo_functions.connectToDatabase();
        await mongo_functions.initializeDatabase();
        console.log('Database connected and initialitzated successfully');
    } catch (error) {
        console.error('Database connection or initialization failed:', error);
    }
})();


app.get("/dashboard", async(req,res) =>{
    if (req.session && req.session.loggedIn)
        return res.status(200).send("");
    else 
    return res.status(401).send("Not authenticated")
});

app.post("/addProduct", async(req,res) =>{
    const productName = req.body.productName;
    const price = req.body.price;
    const image = req.body.image;
    if (productName && price && image){
        const product_exists = await mongo_functions.findProduct(productName);
        if (product_exists != null){
            return res.status(400).send("Product already exists");
        }
        mongo_functions.addProduct(productName, price, image);
        res.status(200).send("Product added");
    }
    else res.status(400).send("Invalid name, price or image");

});

app.post("/deleteProduct", async(req,res) =>{
    const productName = req.body.product;
    if (productName){
        const product_exists = await mongo_functions.findProduct(productName);
        if (product_exists == null){
            return res.status(400).send("Product already exists");
        }
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

    if (productName && (price || image)){
        const product_exists = await mongo_functions.findProduct(productName);
        if (product_exists == null){
            return res.status(400).send("Product doesn't exists");
        }
        if (price && !image){
            const imageURL = product_exists.imageURL;
            await mongo_functions.modifyProduct(productName, {price, imageURL})
        }
        if (image && !price){
            const price_BD = product_exists.price;
            await mongo_functions.modifyProduct(productName, {price_BD, image})
        }
        else {
            await mongo_functions.modifyProduct(productName, {price, image})
        }
        res.status(200).send("Product modified");
    }
    else res.status(400).send("Invalid name, price or image");
});




/************************* UPCOIN *************************/

/*
// INSTANCIA CONTRATO UPCOIN
const abiPath = path.join(__dirname, "../upcoin-hardhat/artifacts/contracts/UPCoin.sol/UPCoin.json");
const upcoinABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;
const upcoinContract = new web3.eth.Contract(upcoinABI, process.env.UPCOIN_DEPLOY_ADDRESS);
*/

// INSTANCIA CONTRATO RELAYER
//const relayerAbiPath = path.join(__dirname, "../upcoin-hardhat/artifacts/contracts/Relayer.sol/Relayer.json");
//const relayerABI = JSON.parse(fs.readFileSync(relayerAbiPath, "utf-8")).abi;

const relayerABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_upcoinAddress",
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
          "name": "user",
          "type": "address"
        }
      ],
      "name": "relayClaimTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "name": "relayMint",
      "outputs": [],
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
      "name": "relayTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "upcoin",
      "outputs": [
        {
          "internalType": "contract UPCoin",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
const relayerContract = new web3.eth.Contract(relayerABI, process.env.RELAYER_DEPLOY_ADDRESS);

// Endpoint para realizar la transferencia con verificación de firma
app.post('/relay-transfer', async (req, res) => {
    const { from, to, amount, signature } = req.body;
    console.log("Datos recibidos:", req.body);
  
    try {
        // Obtener el precio de gas dinámico
        const gasPrice = await web3.eth.getGasPrice();
        console.log("Gas Price obtenido:", gasPrice);
  
        // Estimar el gas necesario
        const gasEstimate = await relayerContract.methods
            .relayTransfer(from, to, amount, signature)
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
            to: process.env.RELAYER_DEPLOY_ADDRESS,
            data: relayerContract.methods
                .relayTransfer(from, to, amount, signature)
                .encodeABI(),
            gas: gasEstimate.toString(),
            maxFeePerGas: maxFeePerGas.toString(),
            maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
            nonce,
            from: process.env.RELAYER_ADDRESS,
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
      const gasEstimate = await relayerContract.methods.relayClaimTokens(userWallet).estimateGas({ from: process.env.RELAYER_ADDRESS});
  
      const block = await web3.eth.getBlock("latest");
      const baseFee = parseInt(block.baseFeePerGas); // Tarifa base actual
  
      // Ajustar valores dinámicamente
      const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei'); // 2 gwei
      const maxFeePerGas = baseFee + parseInt(maxPriorityFeePerGas);
  
      // Construir los datos de la transacción
      const txData = {
        to: process.env.RELAYER_DEPLOY_ADDRESS,
        data: relayerContract.methods.relayClaimTokens(userWallet).encodeABI(),
        gas: gasEstimate.toString(), // Convertir gas a cadena
        //gasPrice: (await web3.eth.getGasPrice()).toString(), // Convertir gasPrice a cadena
        nonce: nonce,
        maxFeePerGas: maxFeePerGas.toString(), // Máximo calculado dinámicamente
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(), // Incentivo ajustado
        from: process.env.RELAYER_ADDRESS, // Dirección del relayer
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

