# moneyflow

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
