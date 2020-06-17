const socket = io()
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const messageContainer = document.getElementById('messages')
const roomContainer = document.getElementById('room-container')
const main = document.querySelector('main')


if (messageForm != null) {
    const name = prompt('what is your name')
    appendMessage('You joined')
    socket.emit('new-user', roomName, name)



    messageForm.addEventListener('submit', e => {
        e.preventDefault(); // prevents page reloading
        const message = messageInput.value
        if(message == '/help'){
            setTimeout(function(){ appendHelpMessage (`SERVER: How to play \n 
        1. You see a picture of a game \n 
        2. if you know the name of the game. Typ it in chat  \n
        3. Typ the name correctly: Good:(Fallout: New Vegas) Wrong:(fallout new vegas) \n
        4. guess right you will get a point \n
        5. after 10 rondes the user with the most points win `) }, 1000);
            messageInput.value = ''
            scrollToBottom();
        }
        if(message == '/room'){
            setTimeout(function(){ appendMessage(`SERVER: Room name: ${roomName}`) }, 1000);
            messageInput.value = ''
            scrollToBottom();
        }
        if(message == '/marco'){
            appendMessage(`You: ${message}`)
            setTimeout(function(){ appendMessage(`SERVER: Polo`) }, 1000);
            messageInput.value = ''
            scrollToBottom();
        }


        else {
            appendMessage(`You: ${message}`)
            socket.emit('send-chat-message', roomName, message)
            messageInput.value = ''
            scrollToBottom();
        }

    })
}

socket.on('room-created', room => {
    const roomElement = document.createElement('li')
    roomElement.innerText = room
    const roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = join
    roomContainer.append(roomElement)
    roomContainer.append(roomlink)
})

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message} `)
    scrollToBottom();

})

socket.on('newImage', data => {
    console.log(data);
    const imgContainer = document.getElementById("gameImg")
    imgContainer.innerHTML = `<img src="${data.gameImg}" alt=""> <h2> What is the name of this game?</h2> `

})

socket.on('correct-message', data => {
    appendMessageCorrect(`SERVER: ${data.name} GOOD JOB`)
    scrollToBottom();

})

socket.on('ronde-message', data => {
    appendRonde(`Ronde: ${data.ronde} / 5`)
    scrollToBottom();

})

socket.on('update-score', data => {
    appendScore(`${data.name}  now have ${data.score} points `)
    scrollToBottom();

})


socket.on('user-connected', (name) => {
    appendMessage(`SERVER: ${name} connected`)
    scrollToBottom();
})

socket.on('user-disconnected', name => {
    appendMessage(`SERVER: ${name} disconnected`)
})

// socket.on('show-users', data => {
//     var i;
// for (i = 0; i < data.name.length; i++) {
//     appendMessage(`SERVER: ${data.name[i]} disfsfssfconnected`)
// }

// })



socket.on('game-over', () => {

    GameOverMessage()
    setTimeout(function(){ window.location.replace("/");}, 10000);


})


function appendMessage(message) {
    const messageElement = document.createElement('li')
    messageElement.innerText = message
    messageContainer.append(messageElement)

}

function appendHelpMessage(message) {
    const messageElement = document.createElement('li')
    messageElement.classList.add("help");
    messageElement.innerText = message
    messageContainer.append(messageElement)

}
function appendMessageCorrect(message) {
    const messageElement = document.createElement('li')
    messageElement.classList.add("correct");
    messageElement.innerText = message
    messageContainer.append(messageElement)

}
function appendRonde(message) {
    const messageElement = document.createElement('li')
    messageElement.classList.add("ronde");
    messageElement.innerText = message
    messageContainer.append(messageElement)

}

function appendScore(message) {
    const messageElement = document.createElement('li')
    messageElement.classList.add("score");
    messageElement.innerText = message
    messageContainer.append(messageElement)

}

function GameOverMessage() {
    const messageElement = document.createElement('section')
    messageElement.classList.add("end-screen");
    messageElement.innerHTML = `<div class="end-screen-message "><h1> Match is over</h1>  </div>`
    main.append(messageElement)

}

// function totalUsers(name) {
//     const messageElement = document.createElement('li')
//     messageElement.classList.add("ronde");
//     messageElement.innerText = message
//     messageContainer.append(messageElement)

// }

function scrollToBottom() {
    const messages = document.getElementById('messages');
    messages.scrollTop = messages.scrollHeight;
}