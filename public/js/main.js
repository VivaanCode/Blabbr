var messagesinchat = '2'

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
var roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
var messagename = 'message';
var firsttimecontent = document.getElementById('firstt');

var defaultt = document.getElementById('default');




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
	const messageContainer = document.querySelector('.chat-messages');
  	const lastMessage = messageContainer.lastElementChild;


	if (lastMessage && lastMessage.querySelector('.meta')?.textContent.trim().split('\n')[0] === message.username) {
		const existingText = lastMessage.querySelector('.text');
		existingText.innerHTML += `<br>${message.text}`;
		return;
	}
    const div = document.createElement('div');
  	div.classList.add(messagename);

    div.innerHTML = `<p class="meta">${message.username}</p>
    <p class="text">${message.text}</p>`;

    messageContainer.appendChild(div);
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
	setTimeout(__init__, 100);
});

function __init__(self){
    const queryStringx = window.location.search;
    const urlParamsx = new URLSearchParams(queryStringx);
    const usrnmx = urlParamsx.get('username')

    let userxx = usrnmx
    let roomxx = roomName.innerText;

    var modal = document.getElementById("myModal");
    var inviteLinkInput = document.getElementById("invite-link");
    var firsttime = document.getElementById("firsttime");

    let invitelink = window.location.origin+'/invite?r='+roomxx
    inviteLinkInput.value = invitelink;

    var span = document.getElementsByClassName("close")[0];
    modal.classList.add("show");
    
    span.onclick = function() {
        modal.classList.remove("show");
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.classList.remove("show");
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

