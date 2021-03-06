
const externalContractsPromise = import("../contracts/external_contracts");


console.log("faucetHelper.js");

const peopleFaucetAddress = "0x9dc1ae7458269e65572ccA76B59Dd19eDc3F1416";

var peopleFaucet;

export function startApp(web3, userAccount) {
  return externalContractsPromise.then(data => {
    var abi = data.default[1].contracts.PEOPLE_FAUCET.abi;
    var address = data.default[1].contracts.PEOPLE_FAUCET.address;
    // const contractInstance = new ethers.Contract(address , abi , signerOrProvider);

  });



  // return externalContractsPromise.then(data => {
  //   var abi = data.default[1].contracts.PEOPLE_FAUCET.abi;
  //   var address = data.default[1].contracts.PEOPLE_FAUCET.address;
  //   peopleFaucet = new web3.eth.Contract(
  //     abi,
  //     address
  //   );
  //   peopleFaucet.events.SendToken({ filter: { Receiver: userAccount } })
  //     .on("data", function (event) {
  //       let data = event.returnValues;
  //       // do something
  //     }).on('error', console.error);
  // })
  // var accountInterval = setInterval(function () {
  //   if (web3.eth.accounts[0] !== userAccount) {
  //     userAccount = web3.eth.accounts[0];
  //   }
  // }, 100);
}

export function getRequestedAddress(wallet_address) {
  return peopleFaucet.methods.requestedAddress(wallet_address).call()
}

export function requestTokens(userAccount) {
  // This is going to take a while, so update the UI to let the user know
  // the transaction has been sent
  // Send the tx to our contract:
  return peopleFaucet.methods.requestTokens()
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
      // Transaction was accepted into the blockchain, let's redraw the UI
    })
    .on("error", function (error) {
      // Do something to alert the user their transaction has failed
    });
}

