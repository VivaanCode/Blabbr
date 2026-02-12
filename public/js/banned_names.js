window.onload = function(){
	let urlParamsxx = new URLSearchParams(window.location.search);
	let usernamexx = urlParamsxx.get('username')
	if (usernamexx == 'Blabbot' || usernamexx == 'Server' || usernamexx == 'Admin' || usernamexx == 'Commands' || usernamexx == 'Blabbr' || usernamexx == 'Blabbr Bot' || usernamexx == 'Bot' || usernamexx == ' '){
		window.location.href = 'https://blabbr.xyz/join?invalid';
	}
}

