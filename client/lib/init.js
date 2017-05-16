// create global `app` namespace
window.app = window.app || {}
// es6 import - notice the capitalized Web3
import Web3 from 'web3'
import ipfs from 'ipfs-js'
window.ipfs = ipfs
ipfs.setProvider()
// initialize web3
// set the provider to our local dev node
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
Meteor.startup(function () {
  EthAccounts.init()
})
