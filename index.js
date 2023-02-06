const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

// db set-up
const password = "ham0427"
const url =
    `mongodb+srv://hamoudi0427:${encodeURIComponent(password)}@cluster0.dz49cjj.mongodb.net/phonebookAppUpdated?retryWrites=true&w=majority`
  
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

// routes
app.get('/api/persons', (request, response) => {
    console.log("GET request for all of the notes")
    Person 
        .find({})
        .then(notes => {
            response.json(notes)
        })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    if (newPerson.name === undefined || newPerson.number === undefined) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = new Person({
        name: newPerson.name, 
        number: newPerson.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(400).json({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

// express set-up 
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})