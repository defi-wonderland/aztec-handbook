# Aztec Handbook by Wonderland

This repository contains the Onboarding to Aztec by Wonderland, a documentation site built with Docusaurus. The Aztec handbook serves as a central knowledge base for the researchers, devs and architects involved in the protocol.

## Structure

- `handbook/` - Contains the Docusaurus website source code
  - `docs/` - Documentation content in Markdown format
  - `src/` - Custom React components and styles
  - `docusaurus.config.js` - Main Docusaurus configuration
  - `sidebar.ts` - Indexer for the docs

### Content

This is a **work in progress**, this is the map of content we want to include (purple is to-do and orange is in progress):
![Handbook Structure](static/img/diagrams/structure-handbook.png)

## Development

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager

### Local Development

1. Install dependencies:
```bash
cd aztec-handbook
npm i
```

2. Start the development server:
```bash
npm run start
```

This will start a local development server and open your browser. Changes are reflected in real-time.

### Building for Production

To create a production build:

```bash
cd aztec-handbook
npm run build
```

The static site will be generated in the `aztec-handbook/build` directory.

### Deployment

The handbook is automatically deployed to Vercel when changes are pushed to the main branch.

## Contributing

1. Create a new branch for your changes
2. Make your changes in the `aztec-handbook/docs` directory
3. Test locally using `npm run start`
4. Submit a pull request

If you have any ideas for improving the handbook, feel free to open an issue (check the templates!) to start a discussion!
