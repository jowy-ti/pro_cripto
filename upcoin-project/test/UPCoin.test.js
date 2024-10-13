// test/UPCoin.test.js
// ejecutar -> npx hardhat test
const { expect } = require("chai");

describe("UPCoin", function () {
    let UPCoin, upcoin, owner, addr1;

    beforeEach(async function () {
        UPCoin = await ethers.getContractFactory("UPCoin");
        [owner, addr1] = await ethers.getSigners();
        upcoin = await UPCoin.deploy(1000000);
    });

    it("debería tener el balance correcto después del despliegue", async function () {
        const balance = await upcoin.balanceOf(owner.address);
        // Siempre se despliega el contrato con 1.000.000 UPC
        expect(balance).to.equal(BigInt(1000000) * BigInt(10 ** 18));
    });

    it("debería transferir tokens correctamente", async function () {
        await upcoin.transfer(addr1.address, 100);
        const balanceAddr1 = await upcoin.balanceOf(addr1.address);
        expect(balanceAddr1).to.equal(100);
    });
});
