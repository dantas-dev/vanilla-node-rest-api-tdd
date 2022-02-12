require('dotenv').config();

const app = require('./app');

app
  .listen(process.env.PORT || 3333, () => console.log('app running at', process.env.PORT));
