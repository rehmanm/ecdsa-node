import { useState } from "react";
import server from "./server";
import * as secp from  "ethereum-cryptography/secp256k1";
import { utf8ToBytes }   from "ethereum-cryptography/utils";
import { keccak256 }  from "ethereum-cryptography/keccak";

function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = "transfer";
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes); 
    const [signature, recoveryBit] = await secp.sign(hash, privateKey, {recovered: true});
    
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: signature.toString().split(","),
        recoveryBit : recoveryBit,
        amount: parseInt(sendAmount),
        recipient,
        message
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
