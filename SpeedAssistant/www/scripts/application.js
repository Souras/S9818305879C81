function triggerDistanceCalc() {
    //  if ($("#target-dest").val() != "") {
    $("#btnGetDirections").trigger("click");
    // }
}

function CalcSpeed() {
    var currentime = CurrentTime();
    //  var Time = $("#target_Time").val();
    var Time = parseFloat($("#showtime").html()) / 60 / 60;
    var Distance = $("#distance").html();
    var speed = parseFloat(Distance) / Time;

    $("#ShowSpeed").html(parseFloat(speed).toFixed(2));
    var gpsspeedInMiles = parseFloat(GPSData.Speed).toFixed(2);
    var gpsspeedInKm = gpsspeedInMiles * 3.6;
    $("#ShowCurrentSpeed").html(gpsspeedInKm);
    //  saysomething(parseFloat(speed).toFixed(2) + "," + " Kilometer" + "Per" + "aaare");
    var NeededSpeed = gpsspeedInKm - speed;
    $("#ShowNeededSpeed").html(NeededSpeed);
    var time = parseInt($("#showtime").html());
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    var hours = Math.floor(time / 3600);
   // time = time - hours * 3600;
    $("#UlLogs").append("<tr><td>" + parseFloat(speed).toFixed(2) + "</td><td>" + gpsspeedInKm + "</td><td>" + $('#distance').html() + "</td><td>" + $('#duration').html() + "</td><td>" + hours + ":" + minutes + ":" + seconds + "</td><td>" + currentime + "</td><tr>");
    saysomething(parseFloat(speed).toFixed(2));
}

function CalTime() {
    alert("CalTime");
    setInterval(updateDisplay, 1000); // every sec call updateDisplay
    CalSpeakDurtion();
}
function updateDisplay() {
    var value = parseInt($('#timer').find('.value').text(), 10);
    value++;
    $('#timer').find('.value').text(value);
    $('#showtime').html($('#target_Time').val() - value);
}

function CalSpeakDurtion() {
    //    var SpekDur = $("#Speak_Duration").val();
    //    if (SpeakDurationInterval === null) {
    //        SpeakDurationInterval = setInterval(triggerDistanceCalc, SpekDur); // every sec call triggerDistanceCalc
    //    }

    startSpeakDurationWorker();
}

var w;

function startWorker() {

    if (typeof (Worker) !== "undefined") {
        if (typeof (w) == "undefined") {
            w = new Worker("scripts/demo_workers.js");
        }
        w.onmessage = function (event) {
            //document.getElementById("timer").innerHTML = event.data;
            $('#timer').find('.value').text(event.data);
            $('#showtime').html($('#target_Time').val() - event.data);
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
    }
    CalSpeakDurtion();
}

var y;
function startSpeakDurationWorker() {

    if (typeof (Worker) !== "undefined") {
        if (typeof (y) == "undefined") {
            y = new Worker("scripts/Distance_workers.js");

        }
        var postdata = {
            "Duration": parseInt($("#Speak_Duration").val())
        };
        y.postMessage(postdata);
        y.onmessage = function (event) {
            triggerDistanceCalc();
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
    }

}

function stopWorker() {
    w.terminate();
    w = undefined;
}

$(document).ready(function () {

    $("#FavoriteLocation").on("pagebeforeshow", function (event) {
        GetFavLoc();
    });

    $("#Map_Collapse").collapsible({
        collapse: function (event, ui) {
            // alert('Collapsed');
            map = null;
            $("#map_canvas").empty();
        }
    });
    $("#Map_Collapse").collapsible({
        expand: function (event, ui) {
            //  alert('Expanded');
            CreateMap();
        }
    });
    //   $("#Map_Collapse").on("collapsiblecollapse", function (event, ui) { alert("collapsiblecollapse"); });
    //  $("#Map_Collapse").on("collapsibleexpand", function (event, ui) { alert("collapsibleexpand"); });

    $('#tblFavLoc').on('click', '.btndOrderItemdelete', function () {
        $(this).closest('tr').remove();
        ClearFavoriteByID($(this).attr("name"));

    });
});

function ShowFavLoc(transaction, results) {
    var i;
    //Iterate through the results
    for (i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);
        var Location = "'" + row.Location + ',' + row.FavoriteTime + "'";
        var FavTime = "'" + row.FavoriteTime + "'";

        $("#tblFavLoc").append('<tr><td>' + row.Custom_Name + '</td><td>' + row.FavoriteTime + '</td><td><a href="#" data-role="button" class="ui-link ui-btn ui-shadow ui-corner-all" onclick=UserFavLocF4mData(' + Location + ')>Navigate</a></td><td><input type="button" class="ui-link ui-btn ui-shadow ui-corner-all btndOrderItemdelete" name=' + row.ID + ' value="X"/></td></tr>');
    }
    $("#tblOrderDetails").table("refresh");
};

function UserFavLocF4mData(data) {
    var Coordinates = data.split(",");
    var lati = Coordinates[0];
    var longi = Coordinates[1];
    var FavTime = Coordinates[2];
    var GetCurrentTime = CurrentTime();
    var Time = TimeDifference(GetCurrentTime, FavTime);
    $("#target_Time").val(Time);
    targetDestination = new google.maps.LatLng(lati, longi);
    CreateMarker(targetDestination);
    window.location.href = "#Map";
}

//function takescreeenshoot() {
//    navigator.screenshot.save(function (error, res) {
//        if (error) {
//            console.error(error);
//        } else {
//            console.log('ok', res.filePath); //should be path/to/myScreenshot.jpg
//            alert(res.filePath);
//        }
//    }, 'jpg', 50, 'myScreenShot');
//}


//$("#CapturedImage").click(function () {
//    var $this = $(this);
//    var offset = $this.offset();
//    var width = $this.width();
//    var height = $this.height();

//    //var centerX = offset.left + width / 2;
//    //var centerY = offset.top + height / 2;
//    var centerX = width / 2;
//    var centerY = height / 2;
//    alert("centerX " + centerX + ", " + "centerY" + centerY);
//});

//$('#CapturedImage').click(function (e) {
//    // var pos = findPos(this);
//    var x = e.offsetX;
//    var y = e.offsetY;
//    var coord = "x=" + x + ", y=" + y;


//    var c = document.getElementById("mycanvas");
//    var ctx = c.getContext("2d");
//    var img = $('#CapturedImage')[0];
//    c.height = img.height;
//    c.width = img.width;
//    ctx.drawImage(img, 0, 0);


//    var p = c.getContext('2d').getImageData(x, y, 1, 1).data;
//    //var canvas = $('<canvas/>')[0];
//    //canvas.width = img.width;
//    //canvas.height = img.height;

//    //var c = canvas.getContext('2d').drawImage(img, x, y, img.width, img.height);
//    //var pixelData = canvas.getContext('2d').getImageData(e.offsetX, e.offsetY, 1, 1).data;
//    //var p = c.getImageData(x, y, 1, 1).data;
//    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
//    $('#status').html(coord + "<br>" + hex);

//    var example = document.getElementById('FillColor');
//    var context1 = example.getContext('2d');
//    //context1.fillStyle = "rgb(255,0,0)";
//    context1.fillStyle = "rgb("+p[0]+","+ p[1]+","+ p[2]+")";
//    context1.fillRect(0, 0, 50, 50);


//    //var img = $('#CapturedImage')[0];
//    //var canvas = $('<canvas/>')[0];
//    //canvas.width = img.width;
//    //canvas.height = img.height;
//    //canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
//});

//function rgbToHex(r, g, b) {
//    if (r > 255 || g > 255 || b > 255)
//        throw "Invalid color component";
//    return ((r << 16) | (g << 8) | b).toString(16);
//}

//function rasterizeHTML1() {
//    var canvas = document.getElementById("mycanvas");
//    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//    rasterizeHTML.drawHTML($("#map_canvas").html(),canvas);
//}