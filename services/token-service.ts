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
    // Create array to hold all tokens including SOL
    const tokens: Token[] = []

    // Get SOL balance
    const solBalance = await helius.connection.getBalance(new PublicKey(walletAddress))
    const solAmount = solBalance / 1e9 // Convert lamports to SOL

    if (solAmount > 0) {
      tokens.push({
        name: 'Solana',
        symbol: 'SOL',
        amount: solAmount,
        decimals: 9,
        valuePerToken: 0, // Will be updated with price data
        totalValue: 0, // Will be updated with price data
        logoURI:
          'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      })
    }

    // Fetch token accounts using standard Solana RPC method
    const response = await helius.connection.getTokenAccountsByOwner(new PublicKey(walletAddress), {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    })

    // Process token accounts
    const tokenAccounts = []

    if (response && response.value) {
      for (const item of response.value) {
        try {
          // Parse token account data
          const accountInfo = item.account
          const data = accountInfo.data

          // Skip if no data
          if (!data) continue

          // Parse token account data
          const accountData = Buffer.from(data)

          // Extract mint address (bytes 0-32)
          const mintAddress = new PublicKey(accountData.slice(0, 32)).toString()

          // Extract amount (bytes 64-72)
          const amountData = accountData.slice(64, 72)
          const amount = Number(amountData.readBigUInt64LE(0))

          if (amount > 0) {
            tokenAccounts.push({
              mint: mintAddress,
              amount: amount,
              // We'll use default values for other fields
              decimals: 0, // Will be updated if we have token metadata
              symbol: 'UNKNOWN',
              name: 'Unknown Token',
            })
          }
        } catch (err) {
          console.error('Error parsing token account:', err)
        }
      }
    }

    // Add token accounts to our tokens array
    for (const account of tokenAccounts) {
      tokens.push({
        name: account.name || 'Unknown Token',
        symbol: account.symbol || 'UNKNOWN',
        amount: account.amount / Math.pow(10, account.decimals || 0),
        decimals: account.decimals || 0,
        valuePerToken: 0, // Will be updated with price data
        totalValue: 0, // Will be updated with price data
        logoURI: '',
      })
    }

    // Update token prices
    return await updateTokenPrices(tokens, tokenAccounts)
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
      if (token.symbol) {
        tokenMintMap.set(token.symbol, token.mint)
      }
    })

    // Get list of CoinGecko IDs to fetch
    const coinGeckoIds = tokens
      .map((token) => {
        let mint = null
        if (token.symbol === 'SOL') {
          mint = 'So11111111111111111111111111111111111111112'
        } else {
          mint = tokenMintMap.get(token.symbol)
        }
        return mint && TOKEN_MINT_TO_COINGECKO_ID[mint] ? TOKEN_MINT_TO_COINGECKO_ID[mint] : null
      })
      .filter(Boolean)

    if (coinGeckoIds.length === 0) {
      return tokens.sort((a, b) => b.totalValue - a.totalValue)
    }

    // Fetch prices from CoinGecko
    const priceData = await coinGeckoClient.simplePrice({
      ids: coinGeckoIds.join(','),
      vs_currencies: 'usd',
    })

    // Update token prices
    return tokens
      .map((token) => {
        let mint = null
        if (token.symbol === 'SOL') {
          mint = 'So11111111111111111111111111111111111111112'
        } else {
          mint = tokenMintMap.get(token.symbol)
        }

        const coinGeckoId =
          mint && TOKEN_MINT_TO_COINGECKO_ID[mint] ? TOKEN_MINT_TO_COINGECKO_ID[mint] : null
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
