require('dotenv').config();
require('express-async-errors');
const auth = require('./middleware/authentication')

const express = require('express');
const connectDB = require('./db/connect');
const authRouter = require('./api/auth')
const jobsRouter = require('./api/jobs')
const app = express();


//security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors())
app.use(xss());
app.use(rateLimiter({windowMs: 15 * 60 * 1000, max: 100}))
// routes
app.get('/', (req, res) => {
  res.send('jobs api')
})
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',auth,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
module.exports = (req, res) => app(req, res);
