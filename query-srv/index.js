const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

const handleEvent = ({ type, data }) => {
  if (type === 'PostCreated') {
    const { id, title } = data

    posts[id] = { id, title, comments: [] }
  }

  if (type === 'CommentCreated') {
    const post = posts[data.postId]
    post.comments.push(data)
  }

  if (type === 'CommentModerated') {
    const { id, postId, status } = data
    const post = posts[postId]
    const comment = post.comments.find(c => c.id === id)
    comment.status = status
  }
}

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/events', (req, res) => {
  const event = req.body

  handleEvent(event)

  res.send({})
})

app.listen(4002, async () => {
  const { data: events } = await axios.get('http://event-bus-srv:4005/events')
  events.forEach(e => handleEvent(e))
  console.log('Listening on 4002')
})
