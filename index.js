require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/persons')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

// routes
app.get('/api/persons', (request, response, next) => {
    console.log("GET request for all of the notes")
    Person 
        .find({})
        .then(notes => {
            console.log(notes)
            response.json(notes)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.find({})
            .then(people => {
                response.send(`Phonebook has info for ${people.length}.`)
            })
            .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
    console.log(request.params.id)
    Person.findById(request.params.id)  
        .then(res => {
            if (res) {
                response.json(res)
            } else {
                response.status(404).end() // not found, no response
            }
        })
        .catch(error => next(error))
    })

app.delete('/api/persons/:id', (request, response, next) => {
    console.log("deleting")
    console.log(request.params.id)
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end() // success, no content
        })
        .catch(error => next(error)) // pass to error handler middleware
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

    person.save()
        .then(savedPerson => {
         response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    console.log("updating")
    console.log(req.params.id)
    const updated = req.body
    console.log(updated)

    Person.findByIdAndUpdate(req.params.id, {number: updated.number})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

// unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(400).json({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

// error handler middleware
const handleError = (error, req, res, next) => {
    console.log(error.message)

    if (error.name == 'CastError') return res.status(400).send({error: 'malformatted id'})
    else if (error.name == 'ValidationError') return res.status(400).json({error: error.message})
    next(error)
}
app.use(handleError)

// express set-up 
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})