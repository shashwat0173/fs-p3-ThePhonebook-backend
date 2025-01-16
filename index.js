const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];


app.get('/api/persons', (req, res) => {
    console.log('Received GET request for all persons');
    res.status(200).json(persons);
    console.log('Sent response with all persons');
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Received GET request for id ${id}`);
    const person = persons.find(person => person.id === id);
    if (person) {
        console.log(`Found person: ${JSON.stringify(person)}`);
        res.status(200).json(person);
    } else {
        console.log(`Person with id ${id} not found`);
        res.status(404).send('Person not found');
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Received DELETE request for id ${id}`);
    const personDel = persons.find(person => person.id === id);
    if (personDel) {
        console.log(`Deleting person ${JSON.stringify(personDel)}`);
        persons = persons.filter(person => person.id !== id);
        console.log(`Deleted person with id ${id}`);
        res.status(200).json(personDel);
    } else {
        console.log(`Person with id ${id} not found`);
        res.status(404).send(`Person with id ${id} not found`);
    }
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    console.log('Received POST request:', body);
    
    if (!body.name || !body.number) {
        console.log('Missing name or number');
        return res.status(400).json({
            error: 'name or number is missing'
        });
    }
    
    if (persons.find(person => person.name === body.name)) {
        console.log('Name already exists:', body.name);
        return res.status(400).json({
            error: 'name already exists in the phonebook'
        });
    }
    
    const person = {
        id: String(Math.floor(Math.random() * 10000)),
        name: body.name,
        number: body.number
    };
    
    persons = persons.concat(person);
    console.log(`Added person: ${JSON.stringify(person)}`);
    res.status(201).json(person);
});

app.get('/info', (req, res) => {
    res.status(200).send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});