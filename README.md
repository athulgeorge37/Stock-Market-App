# Stock-Market-App

Allows user to find a stock and visualise its price over time, and invest with paper money

## Getting Started:

-   Make sure you have node installed
-   Install dependencies with `npm i`
-   Run app with `npm run dev`, this will open a server on http://localhost:3000
-   The entry of the project is in ./src/pages/\_app.tsx
-   Since this is a Next.Js app, it has folder based page routing
-   To start adding content, add stuff to ./src/pages/index.tsx
-   Only add resuable components to ./src/components folder
-   any features should be added to ./src/features folder

## Best Practises We Should Follow:

-   when creating creating any code, try and create a branch first for example:
    -   feature/interactive-graph
-   we will then try and merge this branch to main, to avoid conflicts while coding together
-   please notify the group when adding dependencies.

## API For Stock Trading Data:

-   We are going to be using [Alpha Vantage](https://www.alphavantage.co/) to get stock trading data.
-   There is a 15 minute delay from live data.
-   We will be using a free [API KEY](https://www.alphavantage.co/support/#api-key) that is limited to:
    -   5 API calls a minute
    -   100 API calls a day
