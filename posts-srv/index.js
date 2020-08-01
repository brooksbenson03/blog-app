const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

const sendEvent = async event => {
  await axios.post('http://event-bus-srv:4005/events', event)
}

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/posts/create', async (req, res) => {
  const post = {
    id: randomBytes(4).toString('hex'),
    title: req.body.title
  }
  posts[post.id] = post
  await sendEvent({ type: 'PostCreated', data: post })
  res.status(201).send(post)
})

app.post('/events', (req, res) => {
  res.send({})
})

app.listen(4000, () => {
  console.log('Listening on 4000')
})
