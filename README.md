# 🌎 Catalogue of Languages

## 🔍 Overview

The **Catalogue of Languages** is an interactive table featuring all documented languages from the Wikitongues database. Built on Wikitongues' [_Every Language in the World_ Airtable dataset](https://www.airtable.com/universe/exph5qycoKpX7tPwO/every-language-in-the-world), it provides an easy way to explore global linguistic diversity.

The purpose of this project is to make language exploration simple and accessible, emphasizing linguistic diversity and serving as a resource for researchers, linguists, students and enthusiasts.

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
