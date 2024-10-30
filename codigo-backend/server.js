const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require('body-parser');

require('dotenv').config();
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
const cookieParser = require('cookie-parser');
const mongo_functions = require("./MongoDB.js");
const {Web3} = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));


/*app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));*/
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "123456789",
    resave: true,
    saveUninitialized: true,
}));




app.post("/login", async (req, res) => {
    
    const user = req.body.userName;
    const password = req.body.password;
    //await mongo_functions.addUser(user, password, "d45051ff9f2585fa21d84eb440129656");

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
        
        req.session.user = user;
        req.session.role = "Admin";

        res.cookie('session_id', req.sessionID, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
        });
        return res.status(200).send('Login successful');
    }
    return res.status(400).send('Invalid username or password');
});


app.post("/register", async(req, res) => {
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


app.get("/dashboard", (req,res) =>{
    const sessionId = req.cookies.session_id; // Get the session_id cookie
    if (sessionId){
        console.log('Session ID:', sessionId);
    }
    else {
        console.log("No SESSION ID")
    }
});




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
const relayerContract = new web3.eth.Contract(relayerABI, relayerAddress);

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
