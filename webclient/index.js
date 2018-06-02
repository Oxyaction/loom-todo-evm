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

class ContractClient {
  constructor(privateKey, publicKey) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  async createContract() {
    const client = new Client(
      'default',
      'ws://127.0.0.1:46657/websocket',
      'ws://127.0.0.1:9999/queryws',
    );

    client.txMiddleware = [
      new NonceTxMiddleware(this.publicKey, client),
      new SignedTxMiddleware(this.privateKey)
    ];

    this.from = LocalAddress.fromPublicKey(this.publicKey).toString();
    const web3 = new Web3(new LoomProvider(client));

    const loomContractAddress = await client.getContractAddressAsync('TodoList');

    const contractAddress = CryptoUtils.bytesToHexAddr(loomContractAddress.local.bytes);

    this.contract = new web3.eth.Contract(ABI, contractAddress, { from: this.from });
  }

  addTodo(text) {
    return this.contract.methods.add(text).send();
  }

  getTodoCount() {
    return this.contract.methods.todosCount().call();
  }

  getTodo(id) {
    return this.contract.methods.getTodo(id).call();
  }
}

(async () => {
  const priv = Buffer.from('60ffab7587bc6651e41ae3f03b339b5ad156d4a54a880bf91531acaaf524bbea3ece0e362a98696a59683af08c154285b2849f539f3efd2576973f2d715d59c2', 'hex')
  const pub = CryptoUtils.publicKeyFromPrivateKey(priv);

  const client = new ContractClient(priv, pub);
  await client.createContract();

  try {
    let res = await client.addTodo('buy milk');
    console.log(res.events.Added.returnValues);
    res = await client.getTodoCount();
    console.log(res);
  } catch (e) {
    console.error(e);
  }
})();
