require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('MongoDB URI:', url)

mongoose.set('strictQuery', false)

console.log('Connecting to MongoDB...')
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length >= 4){
    const phonebookEntry = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    console.log('Saving new phonebook entry...')
    phonebookEntry.save().then(result => {
        console.log(`Added ${result.name} with number ${result.number} to phonebook`)
        mongoose.connection.close()
    }).catch((error) => {
        console.error('Error saving phonebook entry:', error.message)
        mongoose.connection.close()
    })
} else {
    console.log('Fetching all phonebook entries...')
    Person.find({}).then(result => {
        console.log('Phonebook entries:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    }).catch((error) => {
        console.error('Error fetching phonebook entries:', error.message)
        mongoose.connection.close()
    })
}