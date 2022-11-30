import server from "./server";
import * as secp from  "ethereum-cryptography/secp256k1";
import { keccak256 }  from "ethereum-cryptography/keccak";
import { toHex }   from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, privateKey, setPrivateKey, balance, setBalance }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    console.log(privateKey, secp.getPublicKey(privateKey))
    setPrivateKey(privateKey);
    const address = toHex(keccak256(secp.getPublicKey(privateKey)))
    setAddress(address)
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Private Key</h1>

      <label>
        Private Key
        <input placeholder="Type in Private Key" value={privateKey} onChange={onChange}></input>
      </label>
      <label>
        Address: { address }
        
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
