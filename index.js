const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Running");
});

io.on("connection", (socket) => {
  console.log("connection is on");
  // my my id
  socket.emit("me", socket.id);

  // calling a user
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    console.log("from calling a user");
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  // answering a user call
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  // hang up
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
