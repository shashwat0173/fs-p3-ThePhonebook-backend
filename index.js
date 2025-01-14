const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('tiny'));

const persons = [
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
]


app.get('/api/persons', (req, res) => {
    res.status(200).json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        res.status(200).json(person);
    } else {
        res.status(404).send('Person not found');
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        persons = persons.filter(person => person.id !== id);
        res.status(204).end();
    } else {
        res.status(404).send('Person not found');
    }
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        });
    }
    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name already exsits in the phonebook'
        });
    }
    const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    };
    persons = persons.concat(person);
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