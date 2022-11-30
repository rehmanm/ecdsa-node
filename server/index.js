const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "b450e3be7e590fd8a09f4bea7a204a6033885fc0886baa0f721fe58e942726ba": 100, //aef3d9a74754b2ecceea7ffe3a0c42681c64b9cf12ad99f40757fd938b17c813
  "35468602dc843b7292468a47973da26671ca46bd35e39c24dd5e59148cf80a92": 50, //8e3c47f435e603fb3c94f092f7c622bdd49fb1f02959a51103bbd8f5e8559e7e
  "c23cb60e44e2fff70c97dd880ccc4c92a2bd495573b431dd6356b4628a6cc5fa": 75, //3dc9c03000f7e80d68a148f8756c967c5b7d3cbaa1925e1e8d18862fdb0c14e1
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recipient, amount, recoveryBit, message } = req.body;
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  const sender = toHex(keccak256(secp.recoverPublicKey(hash, Uint8Array.from(signature), recoveryBit)));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
