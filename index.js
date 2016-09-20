const express = require('express'),
      helmet = require('helmet'),
      mongoose = require('mongoose'),
      morgan = require('morgan'),
      database = require('./options/config').db;


mongoose.connect(database);
mongoose.Promise = global.Promise;
const app = express(),
      db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB.');
})

const port = require('./options/config').port,
      apiRoutes = require('./routes/api');


app.use(morgan('dev'));
app.use(helmet());
app.use('/api', apiRoutes);
app.use('/', express.static('client'));

app.listen(port, () => {
  console.log(`App up at ${port}!`);
})
