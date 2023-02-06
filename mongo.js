const mongoose = require('mongoose')

// make connection
if (process.argv.length < 3) {
    console.log('not enough input paramenters')
    process.exit(1)
}
  
const password = process.argv[2]
  
const url =
    `mongodb+srv://hamoudi0427:${encodeURIComponent(password)}@cluster0.dz49cjj.mongodb.net/phonebookApp?retryWrites=true&w=majority`
  
mongoose.set('strictQuery',false)
mongoose.connect(url)

// schema / model set-up
const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
})
  
const Phone = mongoose.model('Phone', phoneSchema)

// return all documents in collection
if (process.argv.length == 3) {
    Phone
        .find({})
        .then(result => {
            result.forEach(phone => {
                console.log(phone)
            })
            mongoose.connection.close()
        })
    return
}

// creation of new model instance (document)
const newPhone = new Phone({
    name: process.argv[3],
    number: process.argv[4]
})

// putting in database
newPhone
    .save()
    .then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })