const dotenv = require('dotenv');

if ((process.env.NODE_ENV || '').trim() === 'production') {
  dotenv.config({ path: './.env.prod' });
} else {
  dotenv.config({ path: './.env.dev' });
}

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
