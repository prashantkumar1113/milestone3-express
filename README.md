# Milestone Project 3 - YouBetcha

#### Backend repo

## Project Description

A daily-updating sports betting simulation that allows users to bet fake currency on real MLB games

## Project Overview

-   Built in the PERN stack (PostgreSQL, Express.js, React.js, Node.js)
-   This project uses a microservice architecture, with the backend and frontend deployed separately for ease of maintenance
-   The frontend repository can be found at https://github.com/wjtelliott/PERN-3-Front

## Deployment

-   The entirety of this project is deployed on Heroku (Front, back, database)

## Routes

| API URL                                | HTTP Request Type | Expectation                                                               |
| -------------------------------------- | ----------------- | ------------------------------------------------------------------------- |
| `/`                                    | -                 | Home / index page                                                         |
| `/users`                               | -                 | Container for user-related routes                                         |
| `/users/newuser`                       | POST              | Creates a new user on redirect from Auth0                                 |
| `/users/balance/:sub`                  | GET               | Get user bankroll balance                                                 |
| `/users/balance/add/:sub/:amt`         | GET               | Adds a specified amount to a users bankroll                               |
| `/users/balance/sub/:sub/:amt`         | GET               | Subtracts a specified amount from a users bankroll                        |
| ----                                   | ----              | ----                                                                      |
| `/games`                               | -                 | Container for game-related routes                                         |
| `/games/upcoming`                      | POST              | Collects upcoming MLB games from API and posts them to our database       |
| `/games/results`                       | PUT               | Get updated game info, update game and bet tables to reflect game results |
| `/games/upcoming`                      | GET               | Get upcoming games to render info on the front end                        |
| ----                                   | ----              | ----                                                                      |
| `/bets/new`                            | POST              | Post a new bet associated with a user to the database                     |
| `/bets/profile/:sub`                   | GET               | Get a users bets                                                          |
| `/bets/profile/:sub/:start/:end/:type` | GET               | Allows bet pagination by filtered type                                    |

### Project Contributors

-   This project was contributed to by Prashant Kumar, William Elliot, Phillip Splettstoeszser, and Ryan Rasmussen
