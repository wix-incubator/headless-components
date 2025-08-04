# Contributing to Headless Integrations

Thank you for considering contributing to this project! Here are some guidelines and instructions to help you get started.

## Getting Started

- Fork the repository and clone it locally.
- Install dependencies using `yarn install`.
- Make your changes in a new branch.
- Ensure all tests pass before submitting a pull request.

## Publishing Packages

This repository uses a GitHub Actions workflow to publish packages in `packages/headless-components` to npm. Only maintainers should publish new versions.

### Steps to Publish a Package

1. **Update the Version:**

   - Bump the `version` field in the `package.json` of the package you want to publish (e.g., `stores`, `ecom`, or `bookings`).

2. **Push Your Changes:**

   - Commit and push the updated `package.json` to the `main` branch (or open a PR and merge it).

3. **Trigger the Publish Workflow:**

   - Go to the **Actions** tab in the GitHub repository.
   - Select the **Publish Package** workflow from the list.
   - Click **Run workflow**.
   - Enter the package name you want to publish (e.g., `stores`, `ecom`, or `bookings`).
   - Click **Run workflow** to start the publishing process.

4. **NPM Token:**
   - Ensure the repository has an `NPM_TOKEN` secret set up with publish permissions. This is required for the workflow to publish to npm.

### Notes

- Only packages without `"private": true` in their `package.json` can be published.
- The workflow will build and publish the specified package to npm.
- Make sure your changes are merged and the version is updated before publishing.

## Code Style & Testing

- Follow the existing code style.
- Run tests with `yarn test` or the appropriate command for the package.

## Need Help?

If you have any questions, feel free to open an issue or ask in the discussions section.
