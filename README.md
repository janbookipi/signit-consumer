# Bookipi Accounting Web(v2-web)

Web frontend for bookipi

- [Staging](ac-app.bkpi.co)
- [Production](https://web.bookipi.com/)

## Prerequisite

- Configure your npm credential to access company private repos
  - echo "//registry.npmjs.org/:\_authToken=${NPM_TOKEN}" > ~/.npmrc
  - please replace ${NPM_TOKEN} with your own token
- [Volta](https://volta.sh/)
  - Install volta to manage your local nodejs/yarn version
- Configure prettier in your IDE/editor to format the code when it changes, please use the config in the repo
- To align your VSCode settings with the project's recommended configuration:
  - Navigate to the `.vscode` directory at the root of the project.
  - Copy the `common.settings.json` file and rename the copy to `settings.json`.
  - If desired, customize the `settings.json` with your personal preferences.
- A list of recommended VSCode extensions is defined in [.vscode/extensions.json](.vscode/extensions.json). VS Code prompts to install the recommended extensions when a workspace is opened for the first time. Use "Extensions: Show Recommended Extensions" command to review the list.
- (Optional) [Docker](https://www.docker.com/products/docker-desktop/)
  - It is used by CI to build the production build, but not necessary for local build

## Quick start

- Install dependencies: `yarn`
- Build the code:
  - inject environment variables in `.env.dev` when running `yarn build:dev`
  - inject environment variables in `.evn.prod` when running `yarn build:prod`
- Start the server:
  - If you want to connect to remote staging server, run `yarn start`
  - If you want to connect to local server, run `yarn start:local`
- Preview the build result:
  - Firstly, run `yarn build:dev` or `yarn build:prod`
  - Then, run `yarn preview`

## Branching Strategy

- Branch out from `dev` and make sure it is up-to-date, start with a `project/{{PROJECT_NAME}}` branch
- Branch out from project branch and create a `feature/{{FEATURE_NAME}}` branch
- Once development is done, create a pull request to merge feature branch to project branch and have it reviewed
- After it's approved and merged, merge the project branch to `staging` branch for it to be deployed to [staging environment](https://ac-app.bkpi.co/) and move the related task for QA review
- When all features related to project are QA approved and ready for release, merge the project branch to `dev`

## Development

### VSCode auto save & auto format

Copy `common.settings.json` to `settings.json` in `.vscode` directory.

### Git hooks

#### Commit lint

We use [commitlint](https://commitlint.js.org/#/) to lint commit messages.

Please follow this [conventional commit](https://www.conventionalcommits.org/en/v1.0.0) message format.

#### Pre-push

When you push your local commits to remote, pre-push hook will run `yarn lint` to check if there are any lint errors.

If you want to skip lint check, you can use `--no-verify` option. But this is not recommended.

```
git push --no-verify
```

## Deployment ([Procedure](https://app.clickup.com/6912544/v/dc/6jyh0-30082/6jyh0-216382), [Instructions](https://app.clickup.com/6912544/v/dc/6jyh0-30082/6jyh0-216562))

### Staging

- Merge project branch to staging

### Production

- Create a [release plan](https://app.clickup.com/6912544/v/dc/6jyh0-30082/6jyh0-243998) and tag other devs related to the release
- Have all necessary project branches be merged to `dev`
- Create a `release/{{YYYYMMDD}}` branch from `dev`
- Merge release branch to master
- Run `@bookipi release bookipi-web-v2` to automate task creation
- Follow Release plan procedures
- Create a `release-{{YYYYMMDD}}` tag and push it to remote. This will trigger automated deployments
- Note: Currently only Gerry, Zac and Julius has the access to merge pull requests into dev branch and do production release, please ask them to do release for you.

## Testing / Development

### Backend

- [Graphql Playground](https://ac-dev.bkpi.co/gql)
- [Admin Dashboard - Staging](https://ac-dev.bkpi.co/pages/users)
- [Admin Dashboard - Production](https://acct.bookipi.com/pages/users)

### Account creation

- Register with email wrtdw.v2.{{UNIQUE_USERNAME}}@inbox.testmail.app
- Check [Email Debug](https://ac-dev.bkpi.co/debug/emails?page=1&tags=v2.) for email verification
- Some features are available only to stripe enabled countries like US/AU, register while connected to VPN to automatically unlock these features.

### Subscription

- Some features are limited without subscription
- To subscribe, use any testing credit card from [stripe](https://stripe.com/docs/testing) like `4242 4242 4242 4242`, any future date for card expiry, and 3-4 digit security code.

### Subscription Module

- Use `useSubscription` hook
- Render modal with `renderModal`
- Open modal with `openModal`
- Wait for messages and handle with `window.addEventListener('message', callbackFn)`
- See `bookipay-frontend` project for more details

### Apollo Cache Invalidation

- Use 'useInvalidateCache' hook
- Should accept one or more field names for the query cache to be invalidated
- More consistent than refetchQueries since refetchQueries only refetch active queries(will not refetch those from unmounted components)

### Styling

- Use `BDS components` by default. [Check BDS documentation](https://stage-design-system.payroller.com.au/docs/Overview)
- Use `BDS tailwind` for one-off styling (via `bw-` prefix)
- Use `MUI components` as necessary (ideally ask BDS for 'big' components)
- Use `MUI makeStyles` for one-off styles that require specificity
  - `MUI styles` has higher CSS specificity than BDS tailwind as it breaks MUI styling
  - Aim to migrate out of MUI components/styles

### How to use BDS

1. Update to latest `BDS` [Check Release note](https://stage-design-system.payroller.com.au/docs/Releases)
2. Check the component is `BDS` or not in Figma [how to find main component](https://help.figma.com/hc/en-us/articles/360038665934-Edit-main-components)
3. Check the [Docs](https://stage-design-system.payroller.com.au/views/Button) Component page for reference
4. Import the component. In case the component is needed to be updated/fixed, check the below.

### How to contribute to BDS

- BDS is in `payroller-web-partial` repository
- link BDS with `link-bds.sh`. This prevents duplicated React errors
- run `yarn dev` in `packages/bds` directory for hot reload with `Bookipi Accounting Web`
- run `yarn dev:bds` in root directory for developing `BDS` with Docs

### Cypress [Click here for full documentation](https://app.clickup.com/6912544/v/dc/6jyh0-30442/6jyh0-263538)

- Tests are located at `/cypress` folder
- Run `yarn cypress`

## Translation ([Full documentation](https://app.clickup.com/6912544/v/dc/6jyh0-30082/6jyh0-224482))

- Translation uses [react-i18next](https://react.i18next.com/)
- Translations are located at `/public/translations`
- Add [OPENAI_API_KEY](https://platform.openai.com/api-keys),[OPENAI_ORG](https://platform.openai.com/account/organization) values to `.env`
- Edit `/translations/{{namespace}}/en.json` (Create a new namespace if needed)
- After adding 2-3 translations run `yarn translate`, to avoid timeout
- Make sure to review and commit translations

## html-generator

- For local development, run `yarn link` and then `yarn start` in `bookipi-htmlgenerator` project
- In `bookipi-accounting-web` run `yarn link @bookipi/htmlgenerator`
- See `bookipi-htmlgenerator` for more details

## Running tests

### Cypress tests

Tests are located at `/cypress` folder.
To run the test with the cypress GUI, use the following command:

```
yarn cy:open
```

### Unit tests

- Runs tests in watch mode: `yarn test:watch`
- Runs tests once without watch mode, useful for CI/CD pipelines: `yarn test:run`
- Runs tests with Vitest UI, helpful for visualizing test results, filtering tests, and debugging: `yarn test:ui`
- Runs tests once and generate a coverage report: `yarn test:coverage`

### CI dev

Prerequisites for MacOS developers:

- Install [Homebrew](https://brew.sh/) (Used to install `just`).
- Install [Xquartz](https://www.xquartz.org/).
- Run Xquartz before running the tests.

Prequisites for Linux developers:
TODO: Add instructions for linux

To simulate running CI in local, use the following command:

```
yarn ci:dev
```
