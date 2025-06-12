const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const port = 3000;
const courses = require('./data/courses');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

// Add this line:
app.use(expressLayouts);

app.get('/', (req, res) => {
  res.render('pages/studentForm', { courses });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
