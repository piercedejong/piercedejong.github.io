

window.onload = function() {
    var dataPoints = []
    var x = 0
    var chart = new CanvasJS.Chart("chartContainer", {
    	animationEnabled: true,
    	theme: "dark1",
    	title:{
    		text: "GameStop Stock Price"
    	},
        animationEnabled: true,
    	data: [{
    		type: "area",
            fillOpacity: .3,
            risingColor: "#F79B8E",
            color: "#80ff80",
            lineColor: "green",
          	indexLabelFontSize: 16,
    		dataPoints: dataPoints
    	}]
    });


    chart.render();

    dataPoints.push({x: 0, y:193.60})

    chart.render()

    $(".btn-stonks").click(function (){
        var g = 0
        $( ".stock-price" ).each(function( index, element ) {
            var x = Math.floor(Math.random() * 25) + 1
            if(x<=1){
                $(element).text(($(element).text()*1.5).toFixed(2))
                $(element).parent().parent().css("background-color", "rgba(40, 167, 69, 0.3)");
                if(g==0){
                    $("#stonks").attr('src','/images/stonks1.jpg');
                    $("#stonks").addClass("btn-stonks")
                    $("#stonks").removeClass("btn-not-stonks")
                }
            }else if(x<=15){
                $(element).text(($(element).text()*1.02).toFixed(2))
                $(element).parent().parent().css("background-color", "rgba(40, 167, 69, 0.3)");
                if(g==0){
                    $("#stonks").attr('src','/images/stonks1.jpg');
                    $("#stonks").addClass("btn-stonks")
                    $("#stonks").removeClass("btn-not-stonks")
                }
            }else if(x<=20){
                $(element).text(($(element).text()*1.05).toFixed(2))
                $(element).parent().parent().css("background-color", "rgba(40, 167, 69, 0.3)");
                if(g==0){
                    $("#stonks").attr('src','/images/stonks1.jpg');
                    $("#stonks").addClass("btn-stonks")
                    $("#stonks").removeClass("btn-not-stonks")
                }
            }else if(x<=22){
                $(element).text(($(element).text()*1.1).toFixed(2))
                $(element).parent().parent().css("background-color", "rgba(40, 167, 69, 0.3)")
                if(g==0){
                    $("#stonks").attr('src','/images/stonks1.jpg');
                    $("#stonks").addClass("btn-stonks")
                    $("#stonks").removeClass("btn-not-stonks")
                };
            }else if(x<=23){
                $(element).text(($(element).text()*0.95).toFixed(2))
                $(element).parent().parent().css("background-color", "rgba(255, 77, 77, 0.3)");
                if(g==0){
                    $("#stonks").attr('src','/images/notstonks.jpg');
                    $("#stonks").removeClass("btn-stonks")
                    $("#stonks").addClass("btn-not-stonks")
                }

            }
            else if(x<=24){
                $(element).text(($(element).text()*0.8).toFixed(2))
                $(element).parent().parent().css("background-color", "rgba(255, 77, 77, 0.3)");
                if(g==0){
                    $("#stonks").attr('src','/images/notstonks.jpg');
                    $("#stonks").removeClass("btn-stonks")
                    $("#stonks").addClass("btn-not-stonks")
                }
            }
            else if(x<=53){
                $(element).text(($(element).text()*0.87).toFixed(2))
                $(element).parent().parent().css("background-color", "rgba(255, 77, 77, 0.3)");
                if(g==0){
                    $("#stonks").attr('src','/images/notstonks.jpg');
                    $("#stonks").removeClass("btn-stonks")
                    $("#stonks").addClass("btn-not-stonks")
                }
            }
            g++;

        });
        x++
        dataPoints.push({x: x, y: parseInt($("#GME").text())})
        chart.render()
    })




}
