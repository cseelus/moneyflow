# moneyflow

![CI](https://github.com/cseelus/moneyflow/actions/workflows/ci.yml/badge.svg)

Track and visualize your monetary assets over time

## Setup

### Requirements

- Node.js >=20

### Installation and Development

```bash
npm install
npm run dev
```

The application will start on `localhost:3000`.

## Wallet Connection

This application supports Solana wallet connection using Phantom wallet.

### Setup

1. Install the Phantom browser extension from [phantom.app](https://phantom.app/)
2. (Optional) Set `NEXT_PUBLIC_SOLANA_RPC` environment variable to a custom Solana RPC endpoint. If not set, the application will use Devnet by default.

### Usage

- Click the "Connect Wallet" button to connect your Phantom wallet
- After approval, your wallet's public key will be displayed
- The application works against Solana Devnet by default

## Styling

This project uses **Tailwind CSS** for utility-first styling and **shadcn/ui** for consistent, accessible UI components.

### Adding new components

To add new shadcn/ui components:

```bash
npx shadcn@latest add <component>
```

For example, to add a card component:

```bash
npx shadcn@latest add card
```

## Code Style

- Prefer inferred types; avoid explicit type annotations unless necessary for clarity.
- We use Prettier with semi: false; semicolons should be omitted unless required by ASI rules.
- Use `npm run lint` to check for linting issues.
- Use `npm run format` to automatically format code.
- Pre-commit hooks will automatically format and lint your code before committing.
