// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UPCoin is ERC20 {
    mapping(address => bool) private hasClaimedTokens;
    uint256 private constant AIRDROP_AMOUNT = 100 * (10 ** 2); // 100 UPC con 2 decimales

    constructor(uint256 initialSupply) ERC20("UPCoin", "UPC") {
        // Multiplicamos por 10 ** 2 para reflejar los 2 decimales
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Override para establecer los decimales a 2
    function decimals() public view virtual override returns (uint8) {
        return 2;
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

