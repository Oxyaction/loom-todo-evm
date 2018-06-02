const ws = require('isomorphic-ws');
const Web3 = require('web3');

global.WebSocket = ws;

const {
  NonceTxMiddleware,
  SignedTxMiddleware,
  Client,
  LocalAddress,
  CryptoUtils,
  LoomProvider,
} = require('loom-js');

const ABI = require('../dappchain/contracts/TodoList_sol_TodoList');

class ContractClientLoomProvider {
  async createContract(privateKey, publicKey) {
    const client = new Client(
      'default',
      'ws://127.0.0.1:46657/websocket',
      'ws://127.0.0.1:9999/queryws',
    );

    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ];

    const from = LocalAddress.fromPublicKey(publicKey).toString();
    const web3 = new Web3(new LoomProvider(client));

    const loomContractAddress = await client.getContractAddressAsync('TodoList');
    const contractAddress = CryptoUtils.bytesToHexAddr(loomContractAddress.local.bytes);

    this.contract = new web3.eth.Contract(ABI, contractAddress, { from });
  }

  addTodo(text) {
    return this.contract.methods.add('buy milk').call();
  }

  getConstant() {
    return this.contract.methods.getConstant().call();
  }
}
