const express = require('express');
const app = express();
const Joi = require('joi');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//database sample
const users = [
    {
        name: 'Daine Consunji',
        id: 1
    },
    {
        name: 'Trebuy Lacsiram',
        id: 2
    },
    {
        name: 'Ayane Yhubi Montreal',
        id: 3
    },
    {
        name: 'Rozen Azrael Montreal',
        id: 4
    },
    {
        name: 'Krystal Caballero',
        id: 5
    },
    {
        name: 'Alexander Joaquin Montreal',
        id: 6
    },
];

app.get('/', (request, response) => {
    response.send(users);
});


app.get('/users/:id', (request, response) => {
    const user = users.find(user => user.id === parseInt(request.params.id));
    //query database
    if(!user) response.status(404).send('Course does not exist');
    response.send(user);
});

app.post('/users', (request, response) => {
    
    const result = validateData(request.body);
    if(result.error){
        response.status(404).send(result.error.details[0].message);
        return;
    }

    const user = {
        name: request.body.name,
        id: users.length + 1
    }

    //push to database
    users.push(user);
    response.send(user);
});

validateData = (user) => {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(user.body, schema);
}

app.put('/users/:id', (request, response) => {
    const user = users.find(users => user.id === parseInt(request.params.id));
    if(!user) response.status(404).send('User does not exist');
    const {error} = validateData(request.body);
    if(error){
        response.send(error);
        return;
    }

    user.name = request.body.name;
    response.send(user);
});

app.delete('/users/:id', (request, response) => {
    console.log('delete');
    const user = users.find(user => user.id === parseInt(request.params.id));
    if(!user) response.status(404).send('User does not exist');

    const index = users.indexOf(user);
    user.splice(index, 1);

    response.send('Deleted');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});