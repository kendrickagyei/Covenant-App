# Covenant Audit System

## What is this?

Covenant is a financial audit system built specifically for the Presbyterian Church of Ghana. It helps church leadership keep track of income and expenses, generate transparent reports, and review transactions with ease. The app is still being actively developed.

## What can it do?

The app gives you a dashboard with financial summaries and trend charts, a transaction history with filtering and paging, and a form for recording expenses and income. You can navigate between the dashboard, expenses, transactions, portfolio, settings, and support pages. All the data is driven by real church expense records.

## How is it built?

The app uses Electron and Vite for desktop packaging and fast development, React for the page-based UI and component rendering, and custom CSS for styling and responsive layouts. Church expense data is imported through local modules.

## Getting started

To install dependencies, run:

```bash
npm install
```

To start the app in development mode, run:

```bash
npm run dev
```

To build the app for production, run:

```bash
npm run build
```

## A few things to note

The application is under active development and not yet complete. The expenses page and transaction viewer are still being refined for better visibility and usability. The audit workflow is still being structured, and additional reporting pages may be added over time.

## Where things live

The main app shell and page routing are in `src/renderer/src/App.jsx`. Individual page components live in `src/renderer/src/pages/`. Core styles are in `src/renderer/src/assets/main.css`. The church expense dataset is in `data.js`.

## Contributing

This repository is intended for continued development and refinement of the church audit system. If you are contributing, please follow the existing React and CSS structure, keep the page UI consistent, and preserve the audit-focused design.