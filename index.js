const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
var botName = 'Blabbot';
const server = http.createServer(app);
const io = socketio(server);
const fs = require('fs');
const prefix = '/';
var lines = 0;
var s = new Date();
var lxtx;
const admin = 'admin:'
const limit = 1000;
const commands = [prefix + 'clear', prefix + 'help', prefix + admin + 'crash'];
const url = require('url');
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();




app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/arc-sw.js", (req, res) => {
    res.sendFile(__dirname + "/public/js/arc.js")
})

app.get("/chat", (req, res) => {
    res.sendFile(__dirname + "/public/chat.html")
})

app.get("/documentation", (req, res) => {
    res.sendFile(__dirname + "/public/docs.html")
})

app.get("/i", (req, res) => {
    res.sendFile(__dirname + "/public/invite.html")
})

app.get("/privacy-policy", (req, res) => {
    res.sendFile(__dirname + "/public/privacy.html")
})

app.get("/terms", (req, res) => {
    res.sendFile(__dirname + "/public/tos.html")
})

app.get("/join", (req, res) => {
    res.sendFile(__dirname + "/public/join.html")
})

app.get("/click", (req, res) => {
    res.sendFile(__dirname + "/public/click.html")
})

app.get("/c-embedded", (req, res) => {
    res.sendFile(__dirname + "/public/c-framed.html")
})

app.get("/join-embed", (req, res) => {
    res.sendFile(__dirname + "/public/join-embed.html")
})

app.get("/developers", (req, res) => {
    res.sendFile(__dirname + "/public/devs.html")
})

app.get("/sitemap.xml", (req, res) => {
    res.sendFile(__dirname + "/sitemap.xml")
})

app.get("/logo", (req, res) => {
    res.sendFile(__dirname + "/public/images/blabbr.svg")
})

app.get("/embedded", (req, res) => {
    res.sendFile(__dirname + "/public/framed.html")
})




// Here
function tryCommands(mesg, userr) {
    if (mesg == prefix + 'clear') {
        io.to(userr.room).emit('message', formatMessage('Commands', '<meta http-equiv="refresh" content="0">' + userr.username + ' is clearing, please wait..'));
    } else if (mesg == prefix + admin + 'crash') {
        admin_crash();
    } else if (mesg == prefix + 'help') {
        io.to(userr.room).emit('message', formatMessage('Help', 'To make text italic, use asterisks (*) or underscores (_) on either side of text. To make text italic, use two asterisks or two underscores on either side of text. <br><br>Commands:<br><ul><li>' + prefix + 'help: Displays this message</li><li>' + prefix + 'clear: Clears messages (for all users)</li></li></ul>'))
    };
};

function senData(mesgg, userrr, roomm) {
    var latestmessagex = mesgg
    var roomofltstmsg = roomm
};

/*
var d = new Date();
const hours = d.getHours();
const mins = d.getMinutes();
 */

const { //here
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({
        username,
        room
    }) => {
        const user = userJoin(socket.id, username, room);


        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to "' + room + ',"' + username + "!"));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    /*
        var person = prompt("Please enter your new name",+user.username);
        window.location = ('https://Blabbr.teamblabbr.repl.co/chat.html?username='+person+'&room='+user.room);
    */

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        if (commands.includes(msg)) {
            tryCommands(msg, user);
        } else {
            try {
                senData(msg, user, user.room);
                io.to(user.room).emit('message', formatMessage(user.username, md.render(msg)));
                var ltstmsg = msg;
                var ltstmsgxroom = user.room
            } catch (err) {
                console.error('Chat Crashed— Auto rerunning/reran. Error:\n' + err)
            }
            lines++
            s = new Date();
            /*
            var latesthistorymsg = '|| User: ' + user.username + ' || Message: ' + msg + ' || Room: ' + user.room + ' || Time: ' + s + '|| \n \n'
            fs.writeFile('history.md', latesthistorymsg, {
                flag: 'a+'
            }, err => { // o
                if (err) {
                    console.error(err)
                }*/

                if (lines > limit) {
                    fs.writeFile('history.md', '', function() {
                        lines = '0';
                        console.log('done')
                    })
                }
            //})
        }
    });


    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat.`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    });
});




process.on('uncaughtException', function(err) {
    console.log('\nError was found. Server restarted.\nError: ' + err);
});




const PORT = 5000;

app.get('*', (req, res) => {
    res.sendFile(__dirname + "/public/404.html")
})

server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));



