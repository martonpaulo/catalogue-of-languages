# 🌎 Catalogue of Languages

**Catalogue of Languages** is an interactive table featuring all documented languages from the Wikitongues database. Built on the [_Every Language in the World_](https://www.airtable.com/universe/exph5qycoKpX7tPwO/every-language-in-the-world) Airtable dataset, it provides an easy way to explore global linguistic diversity.

This project aims to make language research simple and accessible, serving as a resource for researchers, linguists, students, and enthusiasts.

🔗 Live project: [catalogue-of-languages.vercel.app](https://catalogue-of-languages.vercel.app/)

It’s a React-based application with a dynamic and scalable table, featuring search and navigation capabilities. Designed with best practices in mind, it ensures easy integration of new features and adaptability for larger, production-ready systems.

## 🛠️ Tech Stack

### Frontend Framework

**React + Next.js + TypeScript**

- Combines SSG and SSR for fast loading and optimized SEO.
- TypeScript enhances maintainability with static and safe typing.

### Styling

**Material UI + Material Icons**

- Pre-built, clean and responsive components with validation styles and lazy loading for better UX and performance.
- Web Content Accessibility Guidelines (WCAG) compliant with ARIA attributes and accessible patterns.

### Data Fetching

**React Query**

- Simplifies API integration with caching, refetching, and performance enhancements.

### Linting

**ESLint**

- Enforces clean, consistent code by identifying and fixing potential issues.

### Deployment

**Vercel**

- Enables fast and scalable deployment with automatic builds and previews.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or above)
- **npm** (or other package)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/martonpaulo/catalogue-of-languages.git
   cd catalogue-of-languages
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser at `http://localhost:3000`.

## 📋 Available Scripts

| Script          | Description                                        |
| --------------- | -------------------------------------------------- |
| `npm run dev`   | Starts the development server locally.             |
| `npm run build` | Builds the app for production.                     |
| `npm run start` | Starts the production server (after building).     |
| `npm run lint`  | Runs ESLint to check for style and quality issues. |

## 🌐 API Overview

This project uses data from the Wikitongues [_Every Language in the World_](https://www.airtable.com/universe/exph5qycoKpX7tPwO/every-language-in-the-world) table, publicly available on Airtable. The API is based on a private copy of this dataset hosted in an Airtable workspace.

### API Endpoint Structure

Airtable API requests follow this structure:

```
https://api.airtable.com/v0/{baseId}/{tableId}?maxRecords={maxRecordsNumber}
```

- `{baseId}` starts with `"app"`, `{tableId}` starts with `"tbl"`, and `{viewId}` starts with `"viw"`.
- Authentication is done via **Bearer Token**.

### Example Request

```http
GET https://api.airtable.com/v0/{baseId}/{tableId}?maxRecords=10
Authorization: Bearer YOUR_API_KEY
```

For more details, check the official [Airtable API documentation](https://airtable.com/developers/web/api/).

## 🗂️ Architecture

### Naming Conventions

- **camelCase**: For functions and variables.
- **PascalCase**: For components.

## 🔖 Commit Strategy

Each commit follows a clear, consistent naming convention:

| Type       | Description                               | Example                                 |
| ---------- | ----------------------------------------- | --------------------------------------- |
| `feat`     | Introduces new features.                  | `feat: add filtering functionality`     |
| `fix`      | Fixes bugs.                               | `fix: resolve validation issue in form` |
| `style`    | Updates formatting or styles.             | `style: fix indentation in Listings`    |
| `docs`     | Updates documentation.                    | `docs: add setup instructions`          |
| `refactor` | Refactors code without changing behavior. | `refactor: improve component structure` |
| `test`     | Adds or updates tests.                    | `test: add unit tests for Filters`      |
| `chore`    | Updates build process or tools.           | `chore: update dependencies`            |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
