const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var botName = 'Blabbot';
const prefix = '/';
const commands = [prefix + 'clear', prefix + 'help'];

function escapeHtml(str){
    return String(str||'')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;');
}


app.get("/", (req, res) => {res.sendFile(__dirname + "/public/index.html")})

app.get("/chat", (req, res) => {res.sendFile(__dirname + "/public/chat.html")})

app.get("/i", (req, res) => {res.sendFile(__dirname + "/public/invite.html")})

app.get("/join", (req, res) => {res.sendFile(__dirname + "/public/join.html")})

app.get("/logo", (req, res) => {res.sendFile(__dirname + "/public/images/blabbr.svg")})

app.get("/banned_names.js", (req, res) => {res.sendFile(__dirname + "/public/js/banned_names.js")})



// Here
function tryCommands(mesg, userr) {
	io.to(userr.room).emit('message', formatMessage('Commands', 'Commands:<br><ul><li>' + prefix + 'help: Displays this message</li><li>' + prefix + 'clear: Clears messages (for all users)</li></li></ul>'))
};



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
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);


		socket.join(user.room);

		// Welcome current user
		socket.emit('message', formatMessage(botName, 'Welcome to Blabbr→' + escapeHtml(room) + ', ' + escapeHtml(username) + '!'));

		// Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(botName, `${escapeHtml(user.username)} has joined the chat`)
			);

		const users = getRoomUsers(user.room).map(u => ({ ...u, username: escapeHtml(u.username) }));
		// Send users and room info
		io.to(user.room).emit('roomUsers', {
			room: escapeHtml(user.room),
			users: users
		});
	});

	// Listen for chatMessage
	socket.on('chatMessage', msg => {
		const user = getCurrentUser(socket.id);

		if (commands.includes(msg)) {
			tryCommands(msg, user);
		} else {
			try {
				io.to(user.room).emit('message', formatMessage(escapeHtml(user.username), escapeHtml(msg)));
			}
			catch (err) {
				console.error('Chat Crashed— Auto rerunning/reran. Error:\n' + err)
			}
		}
	});

	socket.on('typing', (isTyping) => {
		const user = getCurrentUser(socket.id);
		if (!user) return;
		if (isTyping) {
			socket.to(user.room).emit('userTyping', user.username);
		} else {
			socket.to(user.room).emit('userStopTyping', user.username);
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

			const users = getRoomUsers(user.room).map(u => ({ ...u, username: escapeHtml(u.username) }));
			// Send users and room info
			io.to(user.room).emit('roomUsers', {
				room: escapeHtml(user.room),
				users: users
			});
		}

	});
});




process.on('uncaughtException', function(err) {
	console.log('\nError was found. Server restarted.\nError: ' + err);
});




const PORT = process.env.PORT || 8000;

app.get('*', (req, res) => {res.sendFile(__dirname + "/public/404.html")})

server.listen(PORT, () => console.log(`Server running!`));