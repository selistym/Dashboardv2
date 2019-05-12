
# Developer Guidelines

## Compilation
To start the next.js based environment, change folder to web and:

	yarn install
	yarn dev (to run the development experience)
	yarn test (to test)

## Styling
Current design is based off Bulma.io stylesheet/grid.
Preferrable (re)use all existing components from bulma and bulma-extensions.
Also use the provided grid.

## Styled Components
Bulma is global to the environment so you have the grid.
When adding components make use of styled-components library

## Storybook
Storybook is not used. (Since next.js can be used and this saves overhead)

## Node modules and package.json
Don't add/change package.json if needed propose/discuss with lead developer

## Transitions
Make use of the react-transition-group library

## Testing
Tests with jest and react-testing-library, not enzyme

## Graphing
For graphing use D3 latest version.

## Form components
Style form components with bulma, thereby use the formik and yup library

## Prettier
Config is nicluded

## Browser compatiblitiy
IE11 compatible, polyfills are included

## JQuery
Not supported and not needed.

## For Running
yarn add next (in web folder)
yarn build
yarn start
