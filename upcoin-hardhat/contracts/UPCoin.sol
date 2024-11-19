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

    constructor(uint256 initialSupply) ERC20("UPCoin", "UPC") {
        // Multiplicamos por 10 ** 2 para reflejar los 2 decimales
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Función para actualizar la dirección del relayer
    function setRelayer(address _relayer) external {
        require(relayer == address(0), "Relayer is already set");
        relayer = _relayer;
    }

    // Override para establecer los decimales a 2
    function decimals() public view virtual override returns (uint8) {
        return 2;
    }

    // Función mint solo accesible por el relayer
    function mint(address to, uint256 amount) public onlyRelayer {
        _mint(to, amount);
    }

    // Reclamar tokens iniciales
    function claimTokens() external {
        require(!hasClaimedTokens[msg.sender], "Tokens already claimed by this address");
        hasClaimedTokens[msg.sender] = true;
        _mint(msg.sender, AIRDROP_AMOUNT);
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
    ) internal view returns (bool) {
        // Lógica para verificar la firma aquí
        return true; // Implementa la lógica de verificación
    }
}

