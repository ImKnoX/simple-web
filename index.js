const express = require('express');
const path = require('path');
const app = express();
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
    res.render('index', {
        title: 'Cat Images Generator',
        data: cats
    });
});

//to get individual cat picture
app.get('/cat/:id', async(req, res) => {
    const cat = await Cat.findByPk(req.params.id);
    if (cat) {
        //res.json(cat);
        res.render('cats', {
            title: `${cat.name}`,
            data: cat
        })
    } else {
        res.status(404).json({ message: 'Meow, Cat not found' });
    }
});

app.get('/post', async(req,res) => {
    res.render('posts', {})
})

//to post cat picture
app.post('/post', async(req, res) => {
    const cat = await Cat.create(req.body);
    if(cat) {
        res.redirect('/'); //after insert new data user will be redirected to homepage
    } else(error) => {
        res.json(error)
    }
});

app.get('/edit/:id', async(req, res) => {
    res.render('updateposts', {});
})

//to update existing cat picture
app.put('/edit/:id', async(req, res) => {
  const cat = await Cat.findByPk(req.params.id);
  if (cat) {
    await cat.update(req.body);
    res.json(cat);
  } else {
    res.status(404).json({ message: 'Meow, Cat not found' });
  }
});

//to delete existing cat picture
app.delete('/delete/:id', async(req,res) => {
    const cat = await Cat.findByPk(req.params.id);
    if (cat) {
      await cat.destroy();
      res.json({ message: 'Meow, Cat deleted' });
    } else {
      res.status(404).json({ message: 'Meow, Cat not found' });
    }
});

app.listen(port ,(error) => {
    if(error) throw error
    console.log(`App is hosting at http://localhost:${port}`);
});
