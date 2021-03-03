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

// Sources Used
//https://github.com/cwilso/volume-meter
// Tutorials from CPSC 581 Winter 2021

window.onload = function() {

    // grab our canvas
	canvasContext = document.getElementById( "meter" ).getContext("2d");
    canvasContext2 = document.getElementById( "meter2" ).getContext("2d");
    canvasMatch = document.getElementById( "meter3" ).getContext("2d");

    canvasContext.width = 600

    maxLoundness = 0;

    audioContext = new(window.AudioContext || window.webkitAudioContext)(); // cross-browser
    var microphone;


    //main block for doing the audio recording
    if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');
        var constraints = { audio: true } // ask for audio media, not video
        navigator.mediaDevices.getUserMedia(constraints)
            .then(
                function(stream) {
                    gotStream(stream)
                })
            .catch(function(err) { console.log('The following error occured: ' + err); })
    } else {
        console.log('getUserMedia not supported on your browser!');
    }
}

function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
}

function drawLoop( time) {
    // clear the background
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);

    // check if we're currently clipping
    if (meter.checkClipping()){
        canvasContext.fillStyle = "red";
        canvasContext2.fillStyle = "rgba(255,0,0,0.2)"
    }else{
        canvasContext.fillStyle = "green";
        canvasContext2.fillStyle = "rgba(0,255,0,0.2)"
    }
    loundness.push(meter.volume)
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
        startPlayer(false)
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
    canvasContext.width = 200
    canvasContext2.width = 200
    canvasMatch.width = 200

    // canvasContext.strokeRect(0, 0, window.innerWidth, window.innerHeight);
    // canvasContext2.strokeRect(0, 0, window.innerWidth, window.innerHeight);
    // canvasMatch.strokeRect(0, 0, window.innerWidth, window.innerHeight);

    if(gameChoice == "match"){
        $("#mode-instruction").text(", match the black bars with your voice in ")
        $("#mode-instruction2").hide()
        $("#instruction").text("Match The Black Bar!")
        matchSound = (Math.random() * (0.500 - 0.150) + 0.150).toFixed(4)
        canvasMatch.fillStyle = "rgba(0,0,0,0.8)"
        canvasMatch.fillRect(0, 0, matchSound*WIDTH, HEIGHT);
    }else if(gameChoice == "quiet"){
        $("#mode-instruction").text(", start making noise into the microphone in ")
        $("#mode-instruction2").text("Failure to make noise is an automatic disqualification")
        $("#instruction").text("Make Noise (Quietly)!")
    }else{
        $("#instruction").text("Make Noise!")
        $("#mode-instruction2").hide()
    }

    drawLoop();

    // canvasContext2.clearRect(0,0,WIDTH,HEIGHT);
    // canvasContext.clearRect(0,0,WIDTH,HEIGHT);

    audioContext.suspend()

    startPlayer(true)
}

function startPlayer(player1){
    $("#current-player").show()
    $("#countdown").text(5)
    $("#player").text(playerData[currentIndex][0])

    $("#remiainig-time").hide()
    $("#loundness").hide()
    $("#next-player-up").hide()

    if(!player1){
        $("#canvas").hide()
    }else{
        $("#canvas").show()
    }


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
            audioContext.suspend()
            // $("#loundness").show()
            // $("#maxVolume").text(maxVolume.toFixed(2))


            averageVolume = 0
            if(gameChoice =="quiet"){
                count = 0
                for(i=0;i<loud.length;i++){
                    //console.log(loud[i])
                    if(loud[i]>0.002){
                        averageVolume+=loud[i]
                        count++;
                    }
                }
                if(count<40){
                    alert("You have been disqualified for not making noise for long enough!")
                    playerData[currentIndex][3] = false
                }else{
                    playerData[currentIndex][3] = true
                }
                //console.log(averageVolume)
                averageVolume = averageVolume / count
            }else{
                for(i=0;i<loud.length;i++){
                    averageVolume+=loud[i]
                }
                averageVolume = averageVolume / loud.length
                playerData[currentIndex][3] = true
            }


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

    if(gameChoice == "loud"){
        sortedArray = sortedArray.reverse()
    }else if(gameChoice =="match"){
        sortedArray = sortedArray.sort((a, b) => Math.abs(a[1] -  matchSound) - Math.abs(b[1] - matchSound));
    }

    //console.log(sortedArray)

    $("#current-player").hide()
    $("#remiainig-time").hide()
    $("#loundness").hide()
    $("#next-player-up").hide()
    $("#results").hide()

    audioContext.close()
    maxVolume = 0;
    meter.volume = 0

    canvasContext2.clearRect(0,0,0,HEIGHT);
    canvasContext.clearRect(0,0,0,HEIGHT);

    $("#canvas").hide()

    finalArray = []

    for(i=0;i<sortedArray.length;i++){
        if(sortedArray[i][3]== true){
            finalArray.push(sortedArray[i])
        }
    }
    $("#winners").show()
    if(finalArray.length>0){
        $("#winner").text(finalArray[0][0])
        if(finalArray.length>1){
            $("#second").text(finalArray[1][0])
            if(finalArray.length>2){
                $("#third").text(finalArray[2][0])
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


    }else{
        alert("Everyone was disqualified!")
        $("#podium").hide()
    }
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
