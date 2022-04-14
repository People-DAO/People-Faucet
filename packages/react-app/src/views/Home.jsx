import { ethers } from "ethers";
import {
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import React, { useCallback, useEffect, useState, useImperativeHandle } from "react";
import SelectInput from "./SelectInput";
import { Steps, Button, message } from "antd";
import { Transactor, Web3ModalSetup } from "../helpers";
import { useStaticJsonRPC } from "../hooks";
import { NETWORKS, ALCHEMY_KEY } from "../constants";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";

const { Step } = Steps;

const web3Modal = Web3ModalSetup();
const USE_BURNER_WALLET = true;

const USE_NETWORK_SELECTOR = false;

const steps = [
  {
    title: "Connect Wallet",
    content: "First-content"
  },
  {
    title: "Tweet Request",
    content: "Second-content"
  },
  {
    title: "Request Funds",
    content: "Last-content"
  },
  {
    title: "Done",
    content: "Last-content"
  }
];

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts, childrenRef }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];
  const [injectedProvider, setInjectedProvider] = useState();
  const [current, setCurrent] = React.useState(0);
  const [address, setAddress] = React.useState("");

  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const mainnetProvider = useStaticJsonRPC(providers);
  const targetNetwork = NETWORKS[selectedNetwork];

  useImperativeHandle(childrenRef, () => ({
    goNext: () => {
      doStep();
    }
  }))


  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  const doStep = () => {
    switch (current) {
      case 0:
        // connect wallet
        setAddress("0x9832794h98uad9da9832794h98uad9da");
        next();
        break;
      case 1:
        // send tweet
        let wallet_last_4 = address.slice(-4);
        window.open(
          `https://twitter.com/intent/tweet?text=Requesting%20%24PEOPLE%20Token%20for%20wallet%20ending%20in%200x...${wallet_last_4}%20from%20https%3A%2F%2Ffaucet.people-dao.com`
        );
        next();
        break;
      case 2:
        // contract interaction
        next();
        break;
      default:
        message.success("Funds are on their way!");
        break;
    }
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const StepContent = () => {
    switch (current) {
      case 0:
        return (
          <h1>Please Connect Your Wallet</h1>
        );
      case 1:
        return (
          <Button type="primary" onClick={doStep}>Tweet Request</Button>
        );
      case 2:
        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1 style={{marginBottom: 20}}>
              People-dao Authenticated Faucet
            </h1>

            <SelectInput handleRequest={doStep}></SelectInput>

            {/* <UserList></UserList> */}
          </div>
        );
      case 3:
        return (
          <h1>
            Funds are on their way!
          </h1>
        );
      default: 
        return <></>;
    }
  }

  return (
    <>
      <Steps current={current} className="step-container">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        <StepContent />
      </div>
    </>
  );
}

export default Home;
