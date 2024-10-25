// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./UPCoin.sol";

contract Relayer {
    UPCoin public upcoin;

    constructor(address _upcoinAddress) {
        upcoin = UPCoin(_upcoinAddress);
    }

    function relayTransfer(
        address from,
        address to,
        uint256 amount,
        bytes memory signature
    ) public {
        upcoin.transferWithSignature(from, to, amount, signature);
        // Paga el gas aquí si es necesario
    }
}