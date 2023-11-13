# Tenzies Game


## **Overview**

Tenzies is a simple web-based dice game where the goal is to roll the dice until all of them show the same value. The game features a timer to track the elapsed time, a roll count, and the ability to freeze individual dice values between rolls.

## **Technologies Used**

* React: JavaScript library for building user interfaces.
* nanoid: A small, secure, URL-friendly unique string ID generator.
* react-confetti: A lightweight React component for confetti animations.
* react-use: A collection of React Hooks.
* useWindowSize: A custom React Hook for getting the current window size.
* useGameTimer: A custom React Hook for managing the game timer.
* useBestTime: A custom React Hook for tracking and updating the best time and roll count.
* useTenziesLogic: A custom React Hook for handling game logic related to Tenzies.

## **Getting Started**
To run the Tenzies game on your local machine, follow these steps:

1. Clone the repository:


`git clone https://github.com/your-username/tenzies-game.git`

2. Navigate to the project directory:


`cd tenzies-game`

3. Install dependencies:

`npm install`

4. Start the development server:

`npm start`

5. Open your browser and go to http://localhost:3000 to play the Tenzies game.

## **Game Instructions**

Click each die to freeze it at its current value between rolls.
Roll the dice until all of them show the same value.
The timer will start when you hold the first die.
The game will reset automatically when Tenzies is achieved.
Click "New Game" to reset the game manually.
Click "Best Time" to display or hide the best time and roll count.

## **Components**

### `App.js`

The main component that renders the game interface. It manages the state of the dice, game timer, best time, and roll count.

### `useBestTime.js`
A custom React Hook for managing the best time and roll count.

### `useTenziesLogic.js`
A custom React Hook for handling game logic related to Tenzies, including determining the majority value of held dice.

### `useGameTimer.js`
A custom React Hook for managing the game timer.
