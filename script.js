const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");

const sendtoInput = document.getElementById("sendto-input");
const titleInput = document.getElementById("title-input");
const messageInput = document.getElementById("message-input");
const timeInput = document.getElementById("time-input");

let name = prompt("What is your email?");

// while (name == "" || !name.includes("@") || !name.includes(".")) {
//   name = prompt("What is your email?");
// }

// appendMessage("You joined");
alert("You are connected!");

socket.emit("new-user", name);

socket.on("chat-message", (data) => {
  appendMessage(data.message, data.title, data.time, data.sendTo);
});

socket.on("delete-message", (data) => {
  console.log("poslano");
  console.log(data.message);
  console.log(data.title);

  document.getElementById(data.message + data.title).remove();
});

// socket.on("user-connected", (name) => {
//   appendMessage(`${name} connected`);
// });

// socket.on("user-disconnected", (name) => {
//   appendMessage(`${name} disconnected`);
// });

socket.on("load-message", (data) => {
  console.log("LOADING");
  data.messages.reverse().forEach((e) => appendMessage(e.message, e.title));
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const sendTo = sendtoInput.value;
  const title = titleInput.value;
  const message = messageInput.value;
  const time = timeInput.value;

  // appendMessage(`You: ${message}`);
  socket.emit("send-chat-message", message, sendTo, title, time, name);
  sendtoInput.value = "";
  titleInput.value = "";
  messageInput.value = "";
  timeInput.value = "";
});

function appendMessage(message, title, time, sendTo) {
  const messageElement = document.createElement("div");
  const titleE = document.createElement("div");
  const bodyE = document.createElement("p");
  titleE.innerText = title;
  bodyE.innerText = message;
  messageElement.append(titleE);
  messageElement.append(bodyE);
  messageElement.id = message + title;

  messageContainer.append(messageElement);
}
