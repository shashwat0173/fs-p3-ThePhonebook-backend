require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/Person');

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

app.get('/api/persons', (req, res, next) => {
    console.log('Received GET request for all persons');
    console.log('Fetching all phonebook entries...');
    Person.find({})
        .then(result => {
            res.status(200).json(result);
            console.log('Sent response with all persons');
        })
        .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    console.log(`Received GET request for id ${id}`);
    Person.findById(id)
        .then(person => {
            if (person) {
                console.log(`Found person: ${JSON.stringify(person)}`);
                res.status(200).json(person);
            } else {
                console.log(`Person with id ${id} not found`);
                res.status(404).send('Person not found');
            }
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    console.log(`Received DELETE request for id ${id}`);
    
    Person.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                console.log(`Deleted person with id ${id}`);
                res.status(200).json(result);
            } else {
                console.log(`Person with id ${id} not found`);
                res.status(404).send(`Person with id ${id} not found`);
            }
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    console.log('Received POST request:', body);
    
    if (!body.name || !body.number) {
        console.log('Missing name or number');
        return res.status(400).json({
            error: 'name or number is missing'
        });
    }

    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                console.log('Name already exists:', body.name);
                return res.status(400).json({
                    error: 'name already exists in the phonebook'
                });
            }

            const person = new Person({
                name: body.name,
                number: body.number
            });

            return person.save();
        })
        .then(savedPerson => {
            console.log(`Added person: ${JSON.stringify(savedPerson)}`);
            res.status(201).json(savedPerson);
        })
        .catch(error => next(error));
});

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(count => {
            res.status(200).send(
                `<p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>`
            );
        })
        .catch(error => next(error));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
