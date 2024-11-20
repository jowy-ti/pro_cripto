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


// Dirección del contrato del Relayer
const relayerAddress = '0x4cB654441C5971b73179DDe42F02f26E7cf3e287';
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
//const relayerContract = new web3.eth.Contract(relayerABI, relayerAddress);

// Dirección del contrato del UPCoin
const upcoinAddress = '0xa8c497025661219231Ae6A2803c57842a26F1F10';
const upcoinABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
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
    "inputs": [],
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
const upcoinContract = new web3.eth.Contract(upcoinABI, upcoinAddress);

// Endpoint para realizar la transferencia
app.post('/relay-transfer', async (req, res) => {
    const { from, to, amount, signature } = req.body;
    console.log("Datos recibidos:", req.body);

    try {
        console.log("Validando firma...");
        const gasPrice = await web3.eth.getGasPrice();
        console.log("Gas Price obtenido:", gasPrice);

        const gasEstimate = await relayerContract.methods.relayTransfer(from, to, amount, signature).estimateGas({ from });
        console.log("Estimación de Gas:", gasEstimate);

        const nonce = await web3.eth.getTransactionCount(process.env.RELAYER_ADDRESS);

        const txData = {
            to: relayerAddress,
            data: relayerContract.methods.relayTransfer(from, to, amount, signature).encodeABI(),
            gas: gasEstimate,
            gasPrice,
            nonce,
            //from: from,
            from: process.env.RELAYER_ADDRESS,
        };

        // Firmar la transacción
        const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY); // original


        // Enviar la transacción firmada
        const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("Transacción:", tx);
        console.log("FIN TRANSACCIÓN");

        //res.json({ message: 'Transferencia realizada', tx });
        res.json({
            message: 'Transferencia realizada',
            tx: {
                blockHash: tx.blockHash,
                blockNumber: tx.blockNumber.toString(), // Convertir blockNumber a cadena
                cumulativeGasUsed: tx.cumulativeGasUsed.toString(), // Convertir cumulativeGasUsed a cadena
                effectiveGasPrice: tx.effectiveGasPrice.toString(), // Convertir effectiveGasPrice a cadena
                from: tx.from,
                gasUsed: tx.gasUsed.toString(), // Convertir gasUsed a cadena
                logs: tx.logs.map(log => ({
                    ...log,
                    blockNumber: log.blockNumber.toString(), // Convertir blockNumber en logs a cadena
                    logIndex: log.logIndex.toString(), // Convertir logIndex a cadena
                    transactionIndex: log.transactionIndex.toString(), // Convertir transactionIndex a cadena
                })),
                logsBloom: tx.logsBloom,
                status: tx.status.toString(), // Convertir status a cadena
                to: tx.to,
                transactionHash: tx.transactionHash,
                transactionIndex: tx.transactionIndex.toString(), // Convertir transactionIndex a cadena
                type: tx.type.toString(), // Convertir type a cadena
            },
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la transferencia' });
    }
});

// Endpoint para realizar la transferencia de tokens iniciales
app.post('/request-initial-tokens', async (req, res) => {
    const { userWallet } = req.body;
  
    try {
      //Obtener el nonce de la transacción
      const nonce = await web3.eth.getTransactionCount(process.env.RELAYER_ADDRESS);
  
      //Construir la transacción para llamar a `transfer` del contrato UPCoin
      const amount = 100 * (10 ** 2); // 100 UPCoin con 2 decimales
      const gasEstimate = await upcoinContract.methods.transfer(userWallet, amount).estimateGas({ from: process.env.RELAYER_ADDRESS });
      const txData = {
        to: upcoinAddress, // Dirección del contrato UPCoin
        data: upcoinContract.methods.transfer(userWallet, amount).encodeABI(),
        gas: gasEstimate, // Estimar el gas necesario (ajusta según sea necesario)
        gasPrice: await web3.eth.getGasPrice(),
        nonce: nonce,
        from: process.env.RELAYER_ADDRESS,
      };
  
      //Firmar la transacción con la clave privada del Relayer
      const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);
  
      //Enviar la transacción firmada
      const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
      console.log("Transacción:", tx);
      console.log("FIN TRANSACCIÓN");
  
  
      //res.json({ message: 'Tokens enviados correctamente', tx });
      res.json({
        message: 'Tokens enviados correctamente',
        tx: {
            blockHash: tx.blockHash,
            blockNumber: tx.blockNumber.toString(), // Convertir blockNumber a cadena
            cumulativeGasUsed: tx.cumulativeGasUsed.toString(), // Convertir cumulativeGasUsed a cadena
            effectiveGasPrice: tx.effectiveGasPrice.toString(), // Convertir effectiveGasPrice a cadena
            from: tx.from,
            gasUsed: tx.gasUsed.toString(), // Convertir gasUsed a cadena
            logs: tx.logs.map(log => ({
                ...log,
                blockNumber: log.blockNumber.toString(), // Convertir blockNumber en logs a cadena
                logIndex: log.logIndex.toString(), // Convertir logIndex a cadena
                transactionIndex: log.transactionIndex.toString(), // Convertir transactionIndex a cadena
            })),
            logsBloom: tx.logsBloom,
            status: tx.status.toString(), // Convertir status a cadena
            to: tx.to,
            transactionHash: tx.transactionHash,
            transactionIndex: tx.transactionIndex.toString(), // Convertir transactionIndex a cadena
            type: tx.type.toString(), // Convertir type a cadena
        },
    });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al enviar los tokens' });
    }
  });

