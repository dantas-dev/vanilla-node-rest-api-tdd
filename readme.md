
![vanilla Node by Eduardo Dantas](https://nodejs.org/static/images/logo.svg)

This is a vanilla [Node.js](https://nodejs.org/) rest API created to show that it is possible to create a rest API using only vanilla Node.js. But in most cases, I would recommend you to use something like Express in a production project for productivity purposes.


## What is inside?

This project uses lot of stuff such as:

- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js](https://nodejs.org/)
- [Chai](https://www.chaijs.com/)
- [Mocha](https://mochajs.org/)
- [Sinon](https://sinonjs.org/)
- [Istanbul](https://istanbul.js.org/)

## Getting Started

1) clone repository and go to project folder

```bash
git clone https://github.com/EduD/vanilla-node-rest-api-tdd.git
cd vanilla-node-rest-api-tdd
```

2) Create .env and populate database:

```bash
# see .env.example to create same variables in .env
touch .env
npm run seed
```

3) run the development server:

```bash
npm run dev
```

You can use [insomnia](https://insomnia.rest/) to test all endpoints

```bash
# ROUTES
GET      /tasks
POST     /tasks
GET      /task/:id
PUT      /task/:id
DELETE   /task/:id
```
## Commands

```bash
# runs your application (you need config your .env with variable "PORT")
npm run dev

# Populate fake data  (you need config your .env with variable "SEED_AMOUNT")
npm run seed

# run all tests
npm run test

# run all unit tests
npm run test:unit

# run all integration tests
npm run test:integration

# run code coverage
npm run test:coverage

```
