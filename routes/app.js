// config env
require('dotenv').config();

// requirements
const express = require('express');
const app = express();

//scraping requirements
const fn_scrapping = require('./scrapping');

//set static public folder
app.use(express.static('public'));

//set view engine
app.set('view engine', 'ejs');
app.set('views', 'public/views');

// functions
function homePage(req, res) {
    res.render('homepage');
}

function searchPage(req, res) {
    req.query.q = req.query.q.trim();
    fn_scrapping.searchQuery(req.query.q).then(obj => res.render('searchresult', {results: obj, resultTitle: req.query.q}));
}

//routes
app.get('/', homePage);
app.get('/search', searchPage);

// app listen
app.listen(process.env.PORT, () => console.log('The app is running at http://localhost:' + process.env.PORT));