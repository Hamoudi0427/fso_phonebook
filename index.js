require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/persons')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

// routes
app.get('/api/persons', (request, response) => {
    console.log("GET request for all of the notes")
    Person 
        .find({})
        .then(notes => {
            console.log(notes)
            response.json(notes)
        })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(res => {
            response.json(res)
        })
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
    // id made my mongodb

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