# Vite Database App
This is a TypeScript-based web application that allows users to **view**, **edit**, and **update** a game dataset stored in an SQLite database. The project is built using Vite (Vanilla TS) for the frontend, Bun for the backend, and Vitest for testing. The application fetches data from a server, displays it in a table, and provides an interface for modifying game details via a pop-up form.

The data comes from a retro video game {dataset](https://www.kaggle.com/datasets/konstantinognev/retro-games) from Kaggle and the sqlite database imports it from a csv in the `public directory`.

Vitest was used for backend and frontend testing. In the backend there are tests for fetching game data correctly, updating game data via POST requests, handling errors properly. In the frontend there is a test to ensure fetching of the correct data.
