import Blockchain from './lib/Blockchain';
import Block from './lib/Block';

const myBlockchain = new Blockchain();

console.log('Mining block 1...');
myBlockchain.addBlock(new Block(1, new Date().toISOString(), { amount: 4 }));

console.log('Mining block 2...');
myBlockchain.addBlock(new Block(2, new Date().toISOString(), { amount: 10 }));

console.log('Is blockchain valid? ' + myBlockchain.isChainValid());

// Test tampering
console.log('Tampering with block 1...');
myBlockchain.chain[1].data = { amount: 100 };
// Even if we recalculate the hash, the chain should be invalid because the next block's previousHash won't match
// myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash(); 

console.log('Is blockchain valid? ' + myBlockchain.isChainValid());

if (!myBlockchain.isChainValid()) {
    console.log('Blockchain validation failed as expected after tampering!');
} else {
    console.log('Blockchain validation unexpectedly passed!');
}
