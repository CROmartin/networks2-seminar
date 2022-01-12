const io = require("socket.io")(3000);

const users = {};
const messages = [];

function privateMessage(name) {
  for (const user in users) {
    if (name === users[user]) {
      return user;
    }
  }
}

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    // socket.broadcast.emit("user-connected", name);
    let client_messages = [];
    messages.forEach((e) => {
      console.log(e);

      if (e.sendTo == name) {
        client_messages.push(e);
        console.log(e);
      }
    });

    console.log("ispred");
    socket.emit("load-message", {
      messages: client_messages,
    });
    console.log("poslje");
  });

  socket.on("send-chat-message", (message, sendTo, title, time, name) => {
    if (privateMessage(sendTo)) {
      let position = message.length;
      messages[message.length] = {
        title: title,
        message: message,
        sendTo: sendTo,
      };

      setTimeout(() => {
        console.log("poruka izbrisana");
        console.log(messages[position]);
        delete messages[position];
        console.log(messages[position]);
        console.log(sendTo);

        socket.broadcast.to(privateMessage(sendTo)).emit("delete-message", {
          message: message,
          title: title,
        });
      }, time * 1000);
    }
    socket.broadcast.to(privateMessage(sendTo)).emit("chat-message", {
      message: message,
      sendTo: sendTo,
      title: title,
      time: time,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    // socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
