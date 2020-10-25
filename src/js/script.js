document.addEventListener("DOMContentLoaded", function() {

	// Wrap every letter in a span
	words = ["connection", "support", "wellness", "mindfullness"]
	addAnimation(words[0])
	i = 1;
	function addAnimation(name){
		var textWrapper = document.querySelector('.ml6 .letters');
		textWrapper.textContent = name
		textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

		anime.timeline({loop: false})
		  .add({
		    targets: '.ml6 .letter',
		    opacity: 1,
		    duration: 1250
		  }).add({
		    targets: '.ml6 .letter',
		    opacity: 0,
		    duration: 1250,
		    easing: "easeOutExpo",
		    delay: 1250
		  });


	}

	interval = setInterval(function(){
		addAnimation(words[i%words.length])
		i++
	},3500)
	

});