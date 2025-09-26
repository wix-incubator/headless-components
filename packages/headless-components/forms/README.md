# @wix/headless-forms

Headless React components for rendering and managing forms. It follows the compound component pattern and integrates with Wix Forms services.

`@wix/headless-forms/react` and `@wix/headless-forms/services` are exported through forms public SDK `@wix/forms`.

## Development Guide

1. **Install Dependencies**
   ```bash
   yarn install
   ```

2. **Start Development**
   ```bash
   # Build in watch mode
   yarn build:watch
   ```

3. **Test Changes Locally**
   Run `examples/astro-forms-demo` to test changes locally.

## Documentation

All changes should be documented using `jsdoc` and updating `docs/api/FORM_INTERFACE.md`.

## Publishing

1. **Update Version**
   - Update version in `package.json`
   - Create PR and merge to main branch

2. **Publish to NPM**
   - Go to GitHub Actions
   - Run "Publish Package" workflow
   - Enter package name: `forms`
   - Monitor the workflow for successful completion

3. **Update SDK Exports**
   - Go to Form app in Wix Dev Center
   - Update SDK exports extensions:
     - "Forms SDK Exports Components"
     - "Forms SDK Exports Services"
  - Release new app version
  - Check if update has been commited to `auto-sdk-packages` repo

