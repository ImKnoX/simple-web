const express = require('express');
const path = require('path');
const app = express();
const jsonData = require('./data.json')
const port = process.env.PORT || 3000;

app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('/views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Cat Images Generator',
        data: jsonData.cats
    });
});

app.listen(port ,(error) => {
    if(error) throw error
    console.log(`App is hosting at http://localhost:${port}`);
});