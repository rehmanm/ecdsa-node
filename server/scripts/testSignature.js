const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");


const privateKey = "aef3d9a74754b2ecceea7ffe3a0c42681c64b9cf12ad99f40757fd938b17c813";
const bytes = utf8ToBytes("transfer");
const hash = keccak256(bytes);
secp.sign(hash, privateKey, { recovered: true }).then((signature) => {

    const [sig, recoveryBit] = signature;
    const sender = secp.recoverPublicKey(hash, sig, recoveryBit)

    console.log("sender", sender);
})





