import { Helius } from 'helius-sdk'
import { CoinGeckoClient } from 'coingecko-api-v3'
import { PublicKey } from '@solana/web3.js'

// Define token interface
export interface Token {
  name: string
  symbol: string
  amount: number
  decimals: number
  valuePerToken: number
  totalValue: number
  logoURI?: string
}

// Initialize CoinGecko client
const coinGeckoClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
})

// Initialize Helius client with API key
// In a production app, this should be stored in an environment variable
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'fallback_api_key'
const helius = new Helius(HELIUS_API_KEY)

// Map of token mint addresses to CoinGecko IDs
const TOKEN_MINT_TO_COINGECKO_ID: Record<string, string> = {
  So11111111111111111111111111111111111111112: 'solana', // SOL
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 'usd-coin', // USDC
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: 'tether', // USDT
  // Add more token mappings as needed
}

/**
 * Fetches token balances for a given wallet address
 */
export async function getTokenBalances(walletAddress: string): Promise<Token[]> {
  try {
    // Fetch token balances from Helius
    const balances = await helius.rpc.getBalances({
      accounts: [walletAddress],
    })

    if (!balances || !balances.tokens || !balances.nativeBalance) {
      return []
    }

    // Create array to hold all tokens including SOL
    const tokens: Token[] = []

    // Add SOL balance
    const solBalance = balances.nativeBalance / 1e9 // Convert lamports to SOL
    if (solBalance > 0) {
      tokens.push({
        name: 'Solana',
        symbol: 'SOL',
        amount: solBalance,
        decimals: 9,
        valuePerToken: 0, // Will be updated with price data
        totalValue: 0, // Will be updated with price data
        logoURI:
          'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      })
    }

    // Add SPL token balances
    for (const token of balances.tokens) {
      if (token.amount > 0) {
        tokens.push({
          name: token.name || 'Unknown Token',
          symbol: token.symbol || 'UNKNOWN',
          amount: token.amount / Math.pow(10, token.decimals),
          decimals: token.decimals,
          valuePerToken: 0, // Will be updated with price data
          totalValue: 0, // Will be updated with price data
          logoURI: token.logoURI,
        })
      }
    }

    // Update token prices
    return await updateTokenPrices(tokens, balances.tokens)
  } catch (error) {
    console.error('Error fetching token balances:', error)
    return []
  }
}

/**
 * Updates token prices using CoinGecko API
 */
async function updateTokenPrices(tokens: Token[], splTokens: any[]): Promise<Token[]> {
  try {
    // Create a map of token mints
    const tokenMintMap = new Map()
    splTokens.forEach((token) => {
      tokenMintMap.set(token.symbol, token.mint)
    })

    // Get list of CoinGecko IDs to fetch
    const coinGeckoIds = tokens
      .map((token) => {
        const mint =
          tokenMintMap.get(token.symbol) ||
          (token.symbol === 'SOL' ? 'So11111111111111111111111111111111111111112' : null)
        return mint ? TOKEN_MINT_TO_COINGECKO_ID[mint] : null
      })
      .filter(Boolean)

    if (coinGeckoIds.length === 0) {
      return tokens
    }

    // Fetch prices from CoinGecko
    const priceData = await coinGeckoClient.simplePrice({
      ids: coinGeckoIds.join(','),
      vs_currencies: 'usd',
    })

    // Update token prices
    return tokens
      .map((token) => {
        const mint =
          tokenMintMap.get(token.symbol) ||
          (token.symbol === 'SOL' ? 'So11111111111111111111111111111111111111112' : null)

        const coinGeckoId = mint ? TOKEN_MINT_TO_COINGECKO_ID[mint] : null
        const price = coinGeckoId && priceData[coinGeckoId]?.usd ? priceData[coinGeckoId].usd : 0

        return {
          ...token,
          valuePerToken: price,
          totalValue: token.amount * price,
        }
      })
      .sort((a, b) => b.totalValue - a.totalValue) // Sort by total value (highest first)
  } catch (error) {
    console.error('Error updating token prices:', error)
    return tokens
  }
}
