import { 
  Wormhole} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { config } from 'dotenv';

config();



// Function to fetch environment variables (like your private key)

const getEnv = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
};

// Signer setup function for different blockchain platforms
export const getSigner = async (chain) => {
  let signer;
  const platform = chain.platform.utils()._platform;

  switch (platform) {
    case 'Solana':
      signer = await (
        await solana()
      ).getSigner(await chain.getRpc(), getEnv('SOL_PRIVATE_KEY'));
      break;
    case 'Evm':
      signer = await (
        await evm()
      ).getSigner(await chain.getRpc(), getEnv('ETH_PRIVATE_KEY'));
      break;
    default:
      throw new Error('Unsupported platform: ' + platform);
  }

  return {
    chain,
    signer,
    address: Wormhole.chainAddress(chain.chain, signer.address()),
  };
};
