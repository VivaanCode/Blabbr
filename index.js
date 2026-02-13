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
const admin = 'admin:'
const commands = [prefix + 'clear', prefix + 'help', prefix + admin + 'crash'];


// example URL: /api/send?username=123&room=hello&msg=mytestytesty


function api_sendmessage(urlx){
  // new URL object
  const current_url = new URL(urlx);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const roomnme = search_params.get('room');
  const usernm = search_params.get('username');
  const messagecontent = search_params.get('msg');


	io.to(roomnme).emit('message', formatMessage(usernm+' (Bot)', messagecontent));
}

function api_getusers(urlx){
  // new URL object
  const current_url = new URL(urlx);
  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  var roomnmex = search_params.get('room');
	if (search_params.has('rawjson')){
		if(search_params.has('plaintext')){
		return JSON.stringify(getRoomUsers(roomnmex))
		} else{
		return getRoomUsers(roomnmex)
		}
	}
	else{
    return JSON.stringify(getRoomUsers(roomnmex))

    fs.readFile(getRoomUsers(roomnmex), 'utf-8', (err, jsonstring) => {
      console.log('<div id="usrs">'+jsonstring+'</div>');
    })
	}
}


function api_getlatestmsg(urlxx){
  // new URL object
  const current_url = new URL(urlxx);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  var roomxx = search_params.get('room');
  

	if (roomofltstmsg = roomxx){
		var lxtx = latestmessagex
		return latestmessagex;
	} else{
		return lxtx
	}
}





app.get("/", (req, res) => {res.sendFile(__dirname + "/public/index.html")})

app.get("/chat", (req, res) => {res.sendFile(__dirname + "/public/chat.html")})

app.get("/documentation", (req, res) => {res.sendFile(__dirname + "/public/docs.html")})

app.get("/i", (req, res) => {res.sendFile(__dirname + "/public/invite.html")})

app.get("/privacy-policy", (req, res) => {res.sendFile(__dirname + "/public/privacy.html")})

app.get("/terms", (req, res) => {res.sendFile(__dirname + "/public/tos.html")})

app.get("/join", (req, res) => {res.sendFile(__dirname + "/public/join.html")})

app.get("/click", (req, res) => {res.sendFile(__dirname + "/public/click.html")})

app.get("/developers", (req, res) => {res.sendFile(__dirname + "/public/devs.html")})

app.get("/sitemap.xml", (req, res) => {res.sendFile(__dirname + "/sitemap.xml")})

app.get("/logo", (req, res) => {res.sendFile(__dirname + "/public/images/blabbr.svg")})

app.get("/api/send", (req, res) => {res.sendFile(__dirname + "/public/api.html")
//api_sendmessage('/api/send?username=123&room=hello&msg=mytestytesty')
api_sendmessage('http://localhost'+req.url)

})

app.get('/api/get/users', (req, res) =>{
	const usersinchat = api_getusers('http://localhost'+req.url)
	res.send(usersinchat)
});

app.get('/api/get/latestmessage', (req, res) =>{
	res.send(api_getlatestmsg('http://localhost'+req.url))
});

app.get("/banned_names.js", (req, res) => {res.sendFile(__dirname + "/public/js/banned_names.js")})



// Here
function tryCommands(mesg, userr) {
	if (mesg == prefix + 'clear') {
		io.to(userr.room).emit('message', formatMessage('Commands', '<meta http-equiv="refresh" content="0">Clearing, please wait..'));
	} else if (mesg == prefix + admin + 'crash') {
		admin_crash();
	} else if (mesg == prefix + 'help') {
		io.to(userr.room).emit('message', formatMessage('Commands', 'Commands:<br><ul><li>' + prefix + 'help: Displays this message</li><li>' + prefix + 'clear: Clears messages (for all users)</li></li></ul>'))
	};
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
				io.to(user.room).emit('message', formatMessage(user.username, msg));
			}
			catch (err) {
				console.error('Chat Crashed— Auto rerunning/reran. Error:\n' + err)
			}
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




const PORT = process.env.PORT || 8000;

app.get('*', (req, res) => {res.sendFile(__dirname + "/public/404.html")})

server.listen(PORT, () => console.log(`Server running! Port in .env`));


if (require.main === module) {
  app.listen(PORT, "localhost", () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}