const express = require('express'),
      helmet = require('helmet'),
      mongoose = require('mongoose'),
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

app.use(helmet());
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`App up at ${port}!`);
})
