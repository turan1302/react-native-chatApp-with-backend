const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const rooms = {}; // KULLANCILAR (MESAJ KISMI ICIN)

const PORT = 3000;

io.on("connection", function(socket) {
  console.log("Birileri Geldi");

  socket.on("add_room", function(data) {
    socket.join(data.room_id);

    const clientsInRoom = io.sockets.adapter.rooms;
    const numClients = clientsInRoom.has(data.room_id) ? clientsInRoom.get(data.room_id).size : 0;
    io.to(data.room_id).emit("join_count", { count : numClients });
  });

  socket.on("leave_room", function(data) {
    socket.leave(data.room_id);

    const clientsInRoom = io.sockets.adapter.rooms;
    const numClients = clientsInRoom.has(data.room_id) ? clientsInRoom.get(data.room_id).size : 0;
    io.to(data.room_id).emit("join_count", { count : numClients });
  });

  socket.on("gonder", function(data) {
    io.to(data.mg_room).emit("gonderData", data);
  });

  socket.on("AddRoomEvent", function(data) {
    io.emit("AddRoomListen", data);
  });

  socket.on("remove_room",function(data){
    io.emit("AddRoomListen");
    io.to(data.room_id).emit("remove_room_process");
  });

  socket.on("disconnect", function() {
    console.log("Birileri Geldi ve Gitti");
    socket.disconnect();
  });
});

http.listen(PORT, (req, res, send) => {
  console.log(`${PORT} portu dinleniyor`);
});
