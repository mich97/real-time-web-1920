require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');


const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const minifyHTML = require('express-minify-html-2');
const compression = require('compression');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, './public/');

const md5 = require('md5');
const timestamp = Date.now();
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const hash = md5(timestamp + privateKey + publicKey);
const url = `http://gateway.marvel.com/v1/public/characters?limit=100&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;


app
    .set('view engine', 'ejs')
    .set('views', 'views')

    .use(compression())
    .use('/', express.static(publicPath))
    .use(bodyParser.urlencoded({extended: true}))

    .use(
        minifyHTML({
            override: true,
            exception_url: false,
            htmlMinifier: {
                removeComments: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeEmptyAttributes: true,
                minifyJS: true,
            },
        })
    )

let rooms = {}

app
    .get('/', (req, res) => {
        res.render('index', {
            rooms: rooms
        })
    })
    .post('/room', (req, res) => {
        if (rooms[req.body.room] != null) {
            return res.redirect('/')
        }
        rooms[req.body.room] = {
            users: {}
        }
        res.redirect(req.body.room)
        // send message that new room was created
        io.emit('room-created', req.body.room)
    })
    .get('/:room', (req, res) => {
        if (rooms[req.params.room] == null) {
            return res.redirect('/')
        }
        res.render('room', {
            roomName: req.params.room,

        })
    })


let charName = '';
let ronde = [1];

io.on('connection', function (socket) {

    socket.on('new-user', (room, name) => {
        rooms[room].users[socket.id] = name

        socket.to(room).broadcast.emit('user-connected', name)

        async function randomGame() {
            fetch(url)
                .then(async response => {
                    const preData = await response.json();
                    const charData = preData.data.results;
                    let randomItem = charData[Math.random() * charData.length | 0];
                    const charImg = `${randomItem.thumbnail.path}.${randomItem.thumbnail.extension}`;
                    charName = randomItem.name;
                    console.log('Name = ' + charName);
                    console.log('Img = ' + charImg);
                    io.in(room).emit('newImage', {
                        gameImg: charImg
                    });
                })
        }

        socket.join(room)

        console.log('Room: ' + [room] + " have " + io.sockets.adapter.rooms[room].length + " players");
        if (io.sockets.adapter.rooms[room].length == 2) {
            console.log('READY')
            randomGame()
            ronde = [1];

            io.in(room).emit('ronde-message', {
                ronde: ronde
            })
        }
    })

    let score = [0]
    socket.on('send-chat-message', (room, message) => {

        if (message == charName) {
            console.log("CORRECT");


            if (ronde == 5) {
                console.log("GAME OVER");
                io.in(room).emit('game-over');
                delete rooms[room];
            } else {
                io.in(room).emit('correct-message', {
                    message: message,
                    name: rooms[room].users[socket.id]
                })
                io.in(room).emit('ronde-message', {
                    ronde: [ronde++],
                    ronde
                })
                io.in(room).emit('update-score', {
                    name: rooms[room].users[socket.id],
                    score: [score++],
                    score
                })
                fetch(url)
                    .then(async response => {
                        const preData = await response.json();
                        const GamesData = preData.data.results;
                        let randomItem = GamesData[Math.random() * GamesData.length | 0];
                        const gameImg = `${randomItem.thumbnail.path}.${randomItem.thumbnail.extension}`;
                        charName = randomItem.name;
                        console.log('Name = ' + charName);
                        console.log('IMG = ' + gameImg);
                        console.log('ronde = ' + ronde);
                        io.in(room).emit('newImage', {
                            gameImg
                        });
                    })
            }
        } else {
            socket.to(room).broadcast.emit('chat-message', {
                message: message,
                name: rooms[room].users[socket.id]
            })
        }
    })

    socket.on('disconnect', function () {
        getUserRooms(socket).forEach(room => {
            socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
        })
    })
})

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names
    }, [])
}


http.listen(port, () => console.log(`App listening on port ${port}!`));