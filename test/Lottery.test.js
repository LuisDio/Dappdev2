const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
// set instance of web3
const web3 = new Web3(ganache.provider());

// ABI and Bytecode
// requiring an object which has interface and bytecode properties
const { interface, bytecode } = require('../compile');


let lottery; // instance of contract
let account; // list of accounts unlocked for us


beforeEach(async () => {
  // get list of accounts
  accounts = await web3.eth.getAccounts();

  // Deploying contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode})
    .send({ from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows an account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });
    const players = await lottery.methods.getPlayer().call({
      from: accounts[0]
    });
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it('allows multiple account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });
    const players = await lottery.methods.getPlayer().call()
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(2, players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {
      try {
        await lottery.methods.enter().send({
          from: accounts[0],
          value: 0
        });
        assert(false);
      } catch (err) {
        assert(err);
      }
  });

  it('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to the winner and reset the player array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0]});
    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const players = await lottery.methods.getPlayer().call();
    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('1.8', 'ether'));
    assert.equal(0, players.length);
    //assert.equal(0, web3.eth.getBalance(Contract.options.address));

  });
});
