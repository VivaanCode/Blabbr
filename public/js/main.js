var messagesinchat = '2'

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
var roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
var messagename = 'message';
var firsttimecontent = document.getElementById('firstt');

var defaultt = document.getElementById('default');


window.onload = function(){
	let urlParamsxx = new URLSearchParams(window.location.search);
	let usernamexx = urlParamsxx.get('username')
	if (usernamexx == 'Blabbot' || usernamexx == 'Server' || usernamexx == 'Admin' || usernamexx == 'Commands' || usernamexx == 'Blabbr' || usernamexx == 'Blabbr Bot' || usernamexx == 'Bot' || usernamexx == ' ' || usernamexx == '' || usernamexx == null){
		window.location.replace('https://blabbr.xyz/join?invalid');
	}

  setTimeout(__init__, 100);
}

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Get username and room from URL
var { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}


function eraseCookie(name) {
	createCookie(name, "", -1);
}

createCookie('user', username)

const socket = io();



// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
	
});

// Message from server
socket.on('message', message => {
	console.log(message);
	outputMessage(message);

	// Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
	e.preventDefault();


	// Get message text
	const msg = e.target.elements.msg.value;

	// Emit message to server
	socket.emit('chatMessage', msg);

	// Clear input
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
	const queryStringx = window.location.search;
	const urlParamsx = new URLSearchParams(queryStringx);
	const usrnmx = urlParamsx.get('username')
  if (message.username == usrnmx){
    const div = document.createElement('div');

  	div.classList.add(messagename);

    div.style.backgroundColor = "rgb(157, 203, 255)";

  	div.innerHTML = `<p class="meta own-msg">${message.username}</p>

    <p class="text">
      ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
  }else{
    const div = document.createElement('div');

    div.style.backgroundColor = "#ebebeb";


  	div.classList.add(messagename);

  	div.innerHTML = `<p class="meta other-msg">${message.username}</p>

    <p class="text">
      ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
  };
}



// Add room name to DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
	userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}




socket.on('roomUsers', ({ room, users }) => {
	var roomName = room;
});



//asdfghjkl;
function __init__(self){

	const queryStringx = window.location.search;

	const urlParamsx = new URLSearchParams(queryStringx);

	const usrnmx = urlParamsx.get('username')


	let userxx = usrnmx
	let roomxx = urlParamsx.get('room')

	// Get the modal
	var modal = document.getElementById("myModal");
	var invitelink = document.getElementById("invite-link");
	var firsttime = document.getElementById("firsttime");

  fetch('https://i.blabbr.xyz/api/create/new/shorturl?u='+userxx+"&r="+roomxx)
    .then(response => response.json())
    .then(data => invitelink.value = "i.blabbr.xyz"+data.message);

	//console.log(invitelink)

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}


}




if (readCookie('firsttime') == "no"){
    firsttimecontent.style.display = "none";
    defaultt.style.display = "block";
} else{
    firsttimecontent.style.display = "block";
    defaultt.style.display = "none";
		createCookie('firsttime', 'no')
}

