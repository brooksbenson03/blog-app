const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())

const sendEvent = async event => {
  await axios.post('http://event-bus-srv:4005/events', event)
}

app.post('/events', async (req, res) => {
  const { type, data } = req.body

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved'
    await sendEvent({
      type: 'CommentModerated',
      data: { ...data, status }
    })
  }

  res.send({})
})

app.listen(4003, () => {
  console.log('Listening on 4003')
})
