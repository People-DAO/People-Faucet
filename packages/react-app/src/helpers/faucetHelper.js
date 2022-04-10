
import Web3, { providers } from 'web3';
const externalContractsPromise = import("../contracts/external_contracts");


var web3 = new Web3(new providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/3f99dbedb75345d2bbce395de75823b9"));
const peopleFaucetAddress = "";

var peopleFaucet;
var userAccount = web3.eth.accounts[0]


function startApp() {
  peopleFaucet = new web3.eth.Contract(
    externalContractsPromise,
    peopleFaucetAddress
  );
  var accountInterval = setInterval(function() {
         
    if (web3.eth.accounts[0] !== userAccount) {
      userAccount = web3.eth.accounts[0];
     
      getZombiesByOwner(userAccount)
      .then(displayZombies);
    }
  }, 100);
  peopleFaucet.events.SendToken({filter: {Receiver: userAccount}})
  .on("data", function(event) {
    let data = event.returnValues;
    // do something
  }).on('error', console.error);

}

function getRequestedAddress(wallet_address) {
  return peopleFaucet.methods.requestedAddress(wallet_address).call()
}

function requestTokens() {
// This is going to take a while, so update the UI to let the user know
        // the transaction has been sent
        $("#txStatus").text("Requesting people Token on the blockchain. This may take a while...");
        // Send the tx to our contract:
        return peopleFaucet.methods.requestTokens()
        .send({ from: userAccount })
        .on("receipt", function(receipt) {
          $("#txStatus").text("Successfully requeted " + "$PEOPLE" + "!");
          // Transaction was accepted into the blockchain, let's redraw the UI
          getZombiesByOwner(userAccount).then(console.log("requested"));
        })
        .on("error", function(error) {
          // Do something to alert the user their transaction has failed
          $("#txStatus").text(error);
        });}

window.addEventListener('load', function() {

    // 检查web3是否已经注入到(Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // 使用 Mist/MetaMask 的提供者
      web3 = new Web3(web3.currentProvider);
    } else {
      // 处理用户没安装的情况， 比如显示一个消息
      // 告诉他们要安装 MetaMask 来使用我们的应用
    }
  
    // 现在你可以启动你的应用并自由访问 Web3.js:
    startApp()
  
  })