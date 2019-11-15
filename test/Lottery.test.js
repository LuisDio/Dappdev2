const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
// set instance of web3
const web3 = new Web3(ganache.provider());

// ABI and Bytecode
// requiring an object which has interface and bytecode properties
const { interface, bytecode } = require(../compile);


let lottery; // instance of contract
let account; // list of accounts unlocked for us


beforeEach(async () => {
  // get list of accounts
  accounts = await web3.eth.getAccounts();

  // Deploying contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode})
    .send({ from: accounts[0], gas: '1000000'});
})
