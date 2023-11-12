<img width="1510" alt="Screenshot 2023-11-12 at 06 17 21" src="https://github.com/marvinjude/chess-tournament/assets/17142206/2d88ca96-908c-4d54-b3bb-9ae263e5887b">

## chess-tournament

FEN notation is like the language most chess apps speak. It helps show where the chess pieces are on the board and whose turn it is to make the next move. With this app, you can type in FEN notation, and it'll draw the chessboard for you. Plus, moving pieces is easy – just click where you want to move from and where you want to move to. You can also swap pieces by double-clicking.

### Demo

[Demo](https://dhis2-chess-by-jude.netlify.app/)

### Installation

Clone the repository:

```sh
git clone https://github.com/marvinjude/chess-tournament.git
```

Install dependencies:

```sh
npm i
```

Start the development server:

```sh
npm run dev
```

### Testing

This project uses a combination of testing tools to ensure the quality and reliability of the code.

- **Unit tests**: [Vitest](https://vitest.dev/) is used to test individual chess-related util functions in isolation to ensure they behave as expected. To run the unit tests, use the command `npm run test:unit`.

- **e2e tests**: [Cypress](https://www.cypress.io/) is used to write basic e2e tests to ensure that the user sees the right thing when they visit the web page. To run the e2e tests, use the command `npm run test:e2e`.

- **Component tests**: [Cypress](https://www.cypress.io/) is also used for component testing. Specifically, we're testing the Chessboard component to make sure that clicks and moves lead to the right result. To run the Component tests , run `npm test:component`.

[GitHub Actions](https://docs.github.com/en/actions) is used to run these tests in CI. The test workflows are located in the [`.github`](https://github.com/marvinjude/chess-tournament/tree/main/.github/) folder

### Design Choices

Lots of design choices were made during the development of this app, but the major ones are as follows:

- **Preserving the state of the board on invalid input**: Unmounting the chessboard anytime the user inputs an invalid FEN notation would lead to a janky UI so I decided to preserve the state of the board and disable the cells until the input is valid. While in that state, users can generate a random FEN notation to clear the error and go back to a good state.

- **Built to be accessible from the ground up**: Whether you want to **tab** around or use the **arrow keys** to navigate between cells, I got you! most features in this application are built so that you won't need a mouse.

- **Tactile Feedback**: Aside from the visual feedback you get when you click around, this application also uses sounds to convey the current action to the user which could make them feel immersed in the 'Game'

### Additions

- [x] **Fallback Mechanism**

  - Allow users to fall back to a working state when the input is incorrect.

- [x] **Preloading Optimization**

  - Preload Chess pieces and sounds to enhance performance by eliminating the need for on-the-fly fetching during rendering.

- [x] **Custom Themes**

  - Provide users with the option to choose from different themes to personalize their experience.

- [x] **Accessibility Enhancements**

  - [x] Tab Navigation
    - Users can navigate, select, and deselect elements using the tab key.
  - [x] Arrow Key Navigation
    - Allow users to navigate the grid using arrow keys for improved accessibility.
  - [x] Keyboard Clicks
    - Users can interact with various UI elements, including buttons, using keyboard inputs.
  - [x] Aria-labels and Roles
    - Enhance accessibility by adding appropriate **aria-labels** and roles to elements.
  - [x] Lighthouse Accessibility Audit
    - Score high on accessibility audits using Lighthouse for improved user experience.

- [x] **Keyboard Shortcuts**

  - [x] `Shift + R` - Generate a random FEN Notation.
  - [x] `Shift + T` - Toggle between different application themes.

- [x] **Tactile Feedback**

  - [x] Cell Click
    - Provide tactile feedback on cell clicks for a more interactive user experience.
  - [x] Random FEN Generation
    - Implement tactile feedback for random FEN generation.
  - [x] Sound Enabled
    - Incorporate tactile feedback for sound-enabled interactions.

- [x] **Tips Dialog**
  - Implement a Tips Dialog to guide users on how to effectively use the application.

### Requirements Checklist

- [x] When a valid FEN string is inserted into a text input it will display the corresponding chess pieces on the board.
- [x] Chess pieces can be rendered either as images or as a text abbreviation of the type of piece (i.e. p for pawn).
- [x] The FEN value should be persisted so that the “game” can continue after the page is reloaded
- [x] Chess pieces can be:
  - [x] selected
  - [x] deselected
  - [x] switched to another piece of the same color by ~~clicking~~ double clicking
- [x] Once a chess piece is selected the piece can be moved by clicking on an empty square or a square occupied by an opposite color.
- [x] Any piece can be moved to any suitable square. The app does not need to enforce chess piece movement rules.
- [x] When a chess piece is moved, the FEN input will be updated with the corresponding value
- [x] Write some tests!

### Todos

- [ ] Write more tests!
- [ ] Fix issue with tabbing in Safari
- [ ] Theme swithing on mobile
- [ ] Improve Perf

### Credits

- Chess Pieces : [skak-svg](https://github.com/MuTsunTsai/skak-svg)
- Sounds:
  - [Soundjay](https://www.soundjay.com/buttons/button-33a.mp3)
  - [Pixabay](https://cdn.pixabay.com/download/audio/2023/06/15/audio_a0e2c53290.mp3?filename=mouse-)
