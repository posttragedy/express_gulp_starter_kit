$(document).ready(function(){
	var timer =  document.getElementById('timer');
	var counter = 0;
	setInterval(function() {
		timer.innerText = counter;
		counter++;
	}, 1000)
});