// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UPCoin is ERC20 {
    address public relayer;

    mapping(address => bool) private hasClaimedTokens;
    uint256 private constant AIRDROP_AMOUNT = 100 * (10 ** 2); // 100 UPC con 2 decimales

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Only Relayer can execute this function");
        _;
    }

    constructor(uint256 initialSupply, address _relayer) ERC20("UPCoin", "UPC") {
        require(_relayer != address(0), "Relayer address cannot be zero");
        // Multiplicamos por 10 ** 2 para reflejar los 2 decimales
        _mint(msg.sender, initialSupply * 10 ** decimals());
        relayer = _relayer;
    }

    // Override para establecer los decimales a 2
    function decimals() public view virtual override returns (uint8) {
        return 2;
    }

    // public: desde fuera y desde dentro
    // Función mint solo accesible por el relayer
    function mint(address to, uint256 amount) public onlyRelayer {
        _mint(to, amount);
    }

    // Reclamar tokens iniciales
    function claimTokens(address user) external onlyRelayer{
        require(!hasClaimedTokens[user], "Tokens already claimed by this address");
        hasClaimedTokens[user] = true;
        _mint(user, AIRDROP_AMOUNT);
    }

    // Función para transferir tokens usando meta-transacciones
    function transferWithSignature(
        address from,
        address to,
        uint256 amount,
        bytes memory signature
    ) public {
        // Validar la firma
        require(verify(from, to, amount, signature), "Invalid signature");
        _transfer(from, to, amount);
    }

    function verify(
        address from,
        address to,
        uint256 amount,
        bytes memory signature
    ) internal pure returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(from, to, amount));
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        address recoveredSigner = ecrecover(ethSignedMessageHash, v, r, s);

        return recoveredSigner == from;
    }

    function splitSignature(bytes memory sig)
    internal
    pure
    returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}

