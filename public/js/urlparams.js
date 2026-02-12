// Demo Link: https://blabbr.xyz/i?u=username&r=room

let urlParamsx = new URLSearchParams(window.location.search);
let roomx = urlParamsx.get('r')
let user = urlParamsx.get('u')
window.onload = function(){
	document.getElementById("title").textContent = ''+user+' Has invited you to join "'+roomx+'"!';
  const input = document.getElementById('roomname');
  input.value = roomx;
}