# Covenant Audit System

## Overview

This application is a financial audit system for the Presbyterian Church of Ghana. It is designed to support oversight of church income and expenses, provide transparent reporting, and make transaction review easier for church leadership.

The project is still in progress.

## Features

- Dashboard with financial summaries and trend charts
- Transaction history viewer with paging and filtering support
- Expense recording form for income and expense entries
- Navigation between dashboard, expenses, transactions, portfolio, settings, and support pages
- Data-driven rendering with church expense records

## Architecture

- Electron + Vite for desktop application packaging and fast development
- React for page-based UI and component rendering
- Custom CSS for styling and responsive layout
- Local module-based data import for church expense records

## Project Setup

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## Development Notes

- The application is under active development and not yet complete.
- The expenses page and transaction viewer are being refined for visibility and usability.
- The audit workflow is still being structured, and additional reporting pages may be added.

## File Structure

- `src/renderer/src/App.jsx` - main app shell and page routing
- `src/renderer/src/pages/` - individual page components
- `src/renderer/src/assets/main.css` - core application styles
- `data.js` - church expense tracker dataset

## Contribution

This repository is intended for continued development and refinement of the church audit system. Contributors should follow the existing React and CSS structure, keep page UI consistent, and preserve the audit-focused design.
