const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const commentsByPostId = {}

const sendEvent = async event => {
  await axios.post('http://event-bus-srv:4005/events', event)
}

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
  const comment = {
    id: randomBytes(4).toString('hex'),
    postId: req.params.id,
    content: req.body.content,
    status: 'pending'
  }
  const comments = commentsByPostId[comment.postId] || []
  comments.push(comment)
  await sendEvent({ type: 'CommentCreated', data: comment })
  res.status(201).send(comment)
})

app.post('/events', async (req, res) => {
  const { type, data } = req.body

  if (type === 'CommentModerated') {
    const { id, postId, status, content } = data
    const comments = commentsByPostId[postId]
    const comment = comments.find(c => c.id === id)
    comment.status = status
    await sendEvent({
      type: 'CommentUpdated',
      data: { id, postId, status, content }
    })
  }

  res.send({})
})

app.listen(4001, () => {
  console.log('Listening on 4001')
})
