import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import * as CONTRACT from "../contracts/external_contracts";
import { Web3ModalSetup } from "../helpers";

function SelectInput({ handleRequest }) {
  const [contractInstance, setcontractInstance] = useState();
  const [btnDisable, setbtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const web3Modal = Web3ModalSetup();

  const init = async () => {
    setbtnDisable(false);
    const provider = await web3Modal.connect();

    const people_abi = CONTRACT[1].contracts.PEOPLE_FAUCET.abi;
    const people_address = CONTRACT[1].contracts.PEOPLE_FAUCET.address;
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    setAddress(address);
    setcontractInstance(new ethers.Contract(people_address , people_abi , signer));
  }

  useEffect(() => {
    init();
  }, [])

  // 调用 requestTokens 获取
  const getToken = async () => {
    try {
      setLoading(true);
      const ret = await contractInstance.requestTokens();
      const retwait = await ret.wait();
      console.log('retwait');
      setLoading(false);
      handleRequest();
    } catch (e) {
      message.error(e?.data?.message || e?.message || `Can't Request Multiple Times`);
      setLoading(false);
      setbtnDisable(true);
    }
  }

  const requestToken = () => {
    getToken();
  }

  return(
    <div>
      <div style={{fontSize: '16px', marginBottom: '30px'}}>Connected to: {address}</div>
      <Button type="primary" disabled={btnDisable} onClick={requestToken} loading={loading}>Request Funds</Button>
    </div>
  )
}

export default SelectInput;
