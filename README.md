# MoneyFlow

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

## Development

### Code Quality

This project uses ESLint and Prettier to maintain code quality and consistency:

- **ESLint**: Linting rules for JavaScript/TypeScript
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Pre-commit Hooks

Pre-commit hooks are automatically set up to:

1. Run ESLint with auto-fix on staged JavaScript/TypeScript files
2. Format staged files with Prettier
3. Ensure code quality before commits

The hooks will automatically run when you commit changes. If there are linting errors that can't be auto-fixed, the commit will be blocked until you fix them.

## Coding Style

- Prefer inferred types; avoid explicit type annotations unless necessary for clarity
- Use single quotes for strings
- Use semicolons
- 2-space indentation
- 80-character line length
- Trailing commas in ES5-compatible contexts
