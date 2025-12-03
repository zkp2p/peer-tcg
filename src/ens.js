import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

// Create client connected to Ethereum mainnet
const client = createPublicClient({
  chain: mainnet,
  transport: http(), // Uses public RPC by default
})

/**
 * Takes an input (ENS name or address) and resolves it
 * Returns both the address and ENS name if available
 */
export async function resolveAddress(input) {
  // If it's an ENS name (ends with .eth)
  if (input.endsWith('.eth')) {
    const address = await client.getEnsAddress({
      name: normalize(input),
    })

    if (!address) {
      throw new Error('ENS name not found')
    }

    return {
      address: address,
      ens: input,
      display: input, // Show ENS on card
    }
  }

  // If it's a regular address, try to reverse resolve
  if (input.startsWith('0x') && input.length === 42) {
    let ens = null

    try {
      ens = await client.getEnsName({
        address: input,
      })
    } catch (e) {
      // No ENS found, that's fine
    }

    // Truncate address for display
    const truncated = `${input.slice(0, 6)}...${input.slice(-4)}`

    return {
      address: input,
      ens: ens,
      display: ens || truncated, // Prefer ENS if found
    }
  }

  throw new Error('Invalid address or ENS name')
}