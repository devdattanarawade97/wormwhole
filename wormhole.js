import { wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { getSigner } from './helpers/helpers.js';

(async function () {



  // Initialize the Wormhole object for the Testnet environment and add supported chains (EVM and Solana)
  const wh = await wormhole('Testnet', [evm, solana] );
console.log("executing bridge ")
  // Set up source and destination chains
  const sendChain = wh.getChain('Ethereum');
  const rcvChain = wh.getChain('Solana');
  console.log("executing signer ")
  // Configure the signers
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // Define the transfer amount (in the smallest unit, so adjust according to your token's decimals)
  const amt = 100_000n; // Example amount

  const automatic = false; // Set to true for automatic transfer

  // Create the transfer object
  const xfer = await wh.tokenTransfer(
    { chain: sendChain.chain, address: '0x1da83C82266101Bfa03c31E8d562C899305f852e' }, // Replace with your token address
    amt,
    source.address,
    destination.address,
    automatic
  );

  
  console.log('Transfer object created:', xfer);

  // Initiate the transfer on the source chain (Solana)
  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(source.signer);
  console.log(`Started Transfer: `, srcTxids);

  // Wait for Attestation (VAA) if manual
  if (!automatic) {
    const timeout = 60 * 1000; // Timeout in milliseconds (60 seconds)
    console.log('Waiting for Attestation');
    const attestIds = await xfer.fetchAttestation(timeout);
    console.log(`Got Attestation: `, attestIds);
  }

  // Complete the transfer on the destination chain (Ethereum)
  console.log('Completing Transfer');
  const dstTxids = await xfer.completeTransfer(destination.signer);
  console.log(`Completed Transfer: `, dstTxids);

  console.log('Transfer status: ', xfer);

  process.exit(0);
})();
