var audioContext = null;
var meter = null;
var canvasContext = null;
var canvasContext2 = null;
var canvasMatch = null;
var maxVolume = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;

var playerData = []
var currentIndex = 0
var nextPlauer = false
var gameChoice = ""
var matchSound = 0

var loundness=[]
var loud = []



window.onload = function() {

    // grab our canvas
	canvasContext = document.getElementById( "meter" ).getContext("2d");
    canvasContext2 = document.getElementById( "meter2" ).getContext("2d");
    canvasMatch = document.getElementById( "meter3" ).getContext("2d");

    canvasContext.width = 600

    maxLoundness = 0;

    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.mediaDevices.getUserMedia =
        	navigator.mediaDevices.getUserMedia ||
        	navigator.mediaDevices.webkitGetUserMedia ||
        	navigator.mediaDevices.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    audioContext.resume();
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating

}

function drawLoop( time) {
    // clear the background
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);

    loundness.push(meter.volume)

    // check if we're currently clipping
    if (meter.checkClipping()){
        canvasContext.fillStyle = "red";
        canvasContext2.fillStyle = "rgba(255,0,0,0.2)"
    }else{
        canvasContext.fillStyle = "green";
        canvasContext2.fillStyle = "rgba(0,255,0,0.2)"
    }

    if(meter.volume > maxVolume){
        maxVolume = meter.volume
        canvasContext2.clearRect(0,0,WIDTH,HEIGHT);
        canvasContext2.fillRect(0, 0, meter.volume*WIDTH, HEIGHT);
    }
    // draw a bar based on the current volume
    canvasContext.fillRect(0, 0, meter.volume*WIDTH, HEIGHT);

    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );
}

$( document ).ready(function() {
    $("#current-player").hide()
    $("#remiainig-time").hide()
    $("#loundness").hide()
    $("#next-player-up").hide()
    $("#winners").hide()
    $("#results").hide()


    $("#player-input").submit(function( event ) {
        event.preventDefault();
        var player
        if($("#player1").first().val()){
            player = [$("#player1").first().val(),0,0]
            playerData.push(player)
            currentIndex = 0
            if($("#player2").first().val()){
                player = [$("#player2").first().val(),0,0]
                playerData.push(player)
            }
            if($("#player3").first().val()){
                player = [$("#player3").first().val(),0,0]
                playerData.push(player)
            }
            if($("#player4").first().val()){
                player = [$("#player4").first().val(),0,0]
                playerData.push(player)
            }
            if($("#player5").first().val()){
                player = [$("#player5").first().val(),0,0]
                playerData.push(player)
            }
            if($("#player6").first().val()){
                player = [$("#player6").first().val(),0,0]
                playerData.push(player)
            }

            gameChoice = $("input[name='gameChoice']:checked").val();

            startGame()
        }else{
            alert("Please enter a name for Player 1")
        }
    });


    $("#next").click(function (){
        startPlayer()
    })

    $("#results").click(function (){
        gameOver()
    })

    $("#play-again").click(function (){
         location.reload();
    })

})

function startGame(){
    $("#player-entry").hide()
    $("#instructions").hide()
    $("#winners").hide()

    console.log(window.innerWidth+50)
    canvasContext.width = 200
    canvasContext2.width = 200
    canvasMatch.width = 200

    // canvasContext.strokeRect(0, 0, window.innerWidth, window.innerHeight);
    // canvasContext2.strokeRect(0, 0, window.innerWidth, window.innerHeight);
    // canvasMatch.strokeRect(0, 0, window.innerWidth, window.innerHeight);

    if(gameChoice == "match"){
        $("#mode-instruction").text(" , match the black bars with your voice in ")
        matchSound = 0.5
        canvasMatch.fillStyle = "rgba(0,0,0,0.8)"
        canvasMatch.fillRect(0, 0, matchSound*WIDTH, HEIGHT);
    }else{
        console.log("hell")
    }

    drawLoop();

    // canvasContext2.clearRect(0,0,WIDTH,HEIGHT);
    // canvasContext.clearRect(0,0,WIDTH,HEIGHT);

    audioContext.suspend()

    startPlayer()
}

function startPlayer(){
    $("#current-player").show()
    $("#countdown").text(5)
    $("#player").text(playerData[currentIndex][0])

    $("#remiainig-time").hide()
    $("#loundness").hide()
    $("#next-player-up").hide()

    $("#canvas").hide()

    maxVolume = 0;
    meter.volume = 0

    canvasContext2.clearRect(0,0,0,HEIGHT);
    canvasContext.clearRect(0,0,0,HEIGHT);

    var counter = 5;
    $("#countdown").text(counter)
    var interval = setInterval(function() {
        counter--
        $("#countdown").text(counter)
        if (counter == 0) {
            playerTurn()
            clearInterval(interval)
        }
    }, 1000);
}

function playerTurn(){
    $("#current-player").hide()
    $("#remiainig-time").show()
    $("#maxVolume").text(3)
    var counter = 3;
    $("#time").text(counter)

    $("#canvas").show()

    maxVolume = 0;
    meter.volume = 0

    audioContext.resume()
    loundness = []
    var interval = setInterval(function() {
        counter--
        $("#time").text(counter)
        if (counter == 0) {
            loud = loundness.slice()
            // console.log(loud)
            audioContext.suspend()
            // $("#loundness").show()
            // $("#maxVolume").text(maxVolume.toFixed(2))

            averageVolume = 0
            for(i=0;i<loud.length;i++){
                averageVolume+=loud[i]
            }
            averageVolume = averageVolume / loud.length

            playerData[currentIndex][1] = averageVolume
            playerData[currentIndex][2] = maxVolume

            //maxVolume= 0

            checkIfNextPlayer()
            if(nextPlayer){
                $("#next-player").text(playerData[currentIndex][0])
                $("#next-player-up").show()
            }else{
                $("#results").show()
            }
            clearInterval(interval)
        }
    }, 1000);
}

function gameOver(){
    var sortedArray = playerData.sort(function(a, b) { return a[1] - b[1]; });

    if(gameChoice == "loudest"){
        sortedArray = sortedArray.reverse()
    }else {
        sortedArray = sortedArray.sort((a, b) => Math.abs(a[1] -  matchSound) - Math.abs(b[1] - matchSound));
    }

    $("#current-player").hide()
    $("#remiainig-time").hide()
    $("#loundness").hide()
    $("#next-player-up").hide()
    $("#results").hide()

    audioContext.suspend()
    maxVolume = 0;
    meter.volume = 0

    canvasContext2.clearRect(0,0,0,HEIGHT);
    canvasContext.clearRect(0,0,0,HEIGHT);

    $("#canvas").hide()



    $("#winner").text(sortedArray[0][0])
    if(sortedArray.length>1){
        $("#second").text(sortedArray[1][0])
        if(sortedArray.length>2){
            $("#third").text(sortedArray[2][0])
        }else{
            $("#third").hide()
            $("#third-step").hide()
        }
    }else{
        $("#third").hide()
        $("#third-step").hide()
        $("#second").hide()
        $("#second-step").hide()
    }

    $("#winners").show()
}




function updatePlayer(player){
    for(i=0;i<playerData.length;i++){
        if(player[0]==playerData[i][0]){
            playerData[i] = player
        }
    }
}

function checkIfNextPlayer(){
    if(currentIndex<playerData.length-1){
        currentIndex++
        nextPlayer = true;
    }else{
        nextPlayer =false
    }
}
