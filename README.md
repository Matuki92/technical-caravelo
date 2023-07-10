# Technical test @ Caravelo

## Project details

The project is powered by Vue 3 + TailwindCSS + Vite + Typescript, unit tests are run with Vitest + Testing Library, along with Playwright for E2E tests.

## Introduction to the exercise

"Our product team has discovered an opportunity to improve our back office platform and UI to make things easier for our clients (airline managers).
We would like to empower the airline support team (the users of our back office platform), to manage the exceptional addition/deduction of a user's subscription quota. In other words, when a flight gets canceled or the service is not delivered as expected, the support team might be required to add or remove flights from a subscriber account to meet the customer promise.
To achieve this, you are required to develop a simple application with a UI that has a button which opens a modal window with the interface needed to manage the quota."

## Acceptance criteria

- The agent will be able to add or reduce quota for a specific subscriber when needed by using a simple interface with two controls (quota field and reason field).
- The agent performing this action will not be able to add or reduce quota without selecting a reason.
- When the agent adds quota, they should be able to see the following options in the 	reason field: 'Subscriber canceled flight', ‘Airline canceled flight', ‘Customer compensation' or  ’Other'.
- When the agent removes quota, they should be able to see the following options in the “reason” field: 'Flight not redeposited after a flight cancellation', ‘Subscriber had log in or - password issues', ‘Subscriber had issues when booking', ‘Subscription has not renewed correctly', ‘Other'.
- The save button will be only active when the quota has been changed and the reason has been selected.
- The agent will not be able to add quota for a subscriber higher than 3 flights.
- The agent will not be able to remove quota for a subscriber lower than 0.
- When the X (close) button is clicked it should close the modal and no change should be applied.
- When the save button is clicked it should save the changes and display a contextual success / error message.

## Setup

- Clone repository.
- Install dependencies with `yarn`.

## Run proyect

- To run the project, run `yarn dev` and load `localhost:8080` in a new tab.

## Testing

- Unit tests can be run with the command `yarn test:unit`.
- End to end tests will run with `yarn test:e2e`.

