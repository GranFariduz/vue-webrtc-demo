const http = require('http')
const socketio = require('socket.io')

const PORT = process.env.PORT || 4000

const httpServer = http.createServer()
const io = socketio(httpServer)

const users = []

io.on('connection', (socket) => {
  socket.on('join', () => {
    console.log(`${socket.id} joined`)

    users.push(socket.id)
    socket.emit('join', socket.id)

    io.emit('user-list', users)
  })

  socket.on('call', (id) => {
    console.log('Call from', socket.id)
    io.to(id).emit('call', socket.id)
  })

  socket.on('offer', (data) => {
    io.to(data.callee).emit('offer', data.offer)
  })

  socket.on('answer', (data) => {
    io.to(data.caller).emit('answer', data.answer)
  })

  socket.on('candidate', (data) => {
    io.to(data.callee).emit('candidate', data.candidate)
  })

  socket.on('leave', (id) => {
    console.log(`${id} disconnected from the socket connection`)

    const userIndex = users.findIndex((user) => user === id)
    users.splice(userIndex, 1)

    socket.disconnect()
  })
})

httpServer.listen(PORT, () => console.log(`Server running on PORT [${PORT}]`))
