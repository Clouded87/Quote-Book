# GitHub Pages Deployment Instructions

## Development

Run the development server locally:
```bash
npm run dev
```

This will start a local server at `http://localhost:3000`

## Building for Production

Build the project:
```bash
npm run build
```

This creates a `dist` folder with all bundled files ready for deployment.

## Deploying to GitHub Pages

### Option 1: Manual Deployment

1. Build the project: `npm run build`
2. Go to your GitHub repository settings
3. Navigate to Pages → Source
4. Select "Deploy from a branch"
5. Select the branch where you'll push the `dist` folder
6. Copy the contents of the `dist` folder to your deployment branch

### Option 2: Using GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

Then enable GitHub Pages in your repository settings with source set to "GitHub Actions".

## Testing the Build Locally

Preview the production build:
```bash
npm run preview
```

This serves the `dist` folder locally for testing before deployment.
