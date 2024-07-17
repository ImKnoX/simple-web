const express = require('express');
const path = require('path');
const app = express();
const jsonData = require('./data.json');
const { Sequelize, Model, DataTypes } = require('sequelize')
const port = process.env.PORT || 3000;
require('dotenv').config();

//initialize the database 
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

//create the cat database model
class Cat extends Model {}

Cat.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    src: DataTypes.STRING
}, { sequelize, modelName: 'cat' });

//start the database
(async () => {
    await sequelize.sync({ force: true });
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();


app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('/views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', async(req, res) => {
    const cats = await Cat.findAll();
    res.json(cats);
    /*
    res.render('index', {
        title: 'Cat Images Generator',
        data: jsonData.cats
    });
    */
});

app.get('/:id', async(req, res) => {
    const cat = await Cat.findByPk(req.params.id);
    res.json(cat);
});

app.listen(port ,(error) => {
    if(error) throw error
    console.log(`App is hosting at http://localhost:${port}`);
});