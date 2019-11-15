const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'material still victory effort pass pill error fortune mesh remind jar dash',
  'https://rinkeby.infura.io/v3/25be984e4de74a35a7f5f489b18ac6b2'
);

const web3 = new Web3(provider);

const deploy = async () => {
  //fectch account to use for deployment
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  // Deploy with a transaction required from 1st account
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy( { data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract deployed to ', result.options.address);
};

deploy()
