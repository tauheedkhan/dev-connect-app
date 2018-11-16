const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const port = process.env.PORT || 3000
const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// DB Config
const {mongoURI} = require('./config/keys')

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log('Mongodb connected'))
  .catch(err => console.log(err))

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

// Passport middleware
app.use(passport.initialize())
require('./config/passport')(passport)

// Use routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)
