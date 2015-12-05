
var currentPosition;
var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();

function CreateMap(pos) {
    var options = {
        zoom: 15,
        center: currentPosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), options);

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    google.maps.event.addListener(map, 'click', function (event) {
        var test = event;
        //  alert("Latitude: " + event.latLng.B + " " + ", longitude: " + event.latLng.k);
        var longi = event.latLng.B;
        var lati = event.latLng.k;
        targetDestination = new google.maps.LatLng(lati, longi);
        CreateMarker(targetDestination);
    });

    
    directionsDisplay.setMap(map);
    initialize();
    getcenter();

    overlay = new google.maps.OverlayView();
    overlay.draw = function () { };
    overlay.setMap(map);
}

function RemoveCreateTrackerMarker() {
    for (var i = 0; i < MarkerStartNEnd.length; i++) {
        MarkerStartNEnd[i].setMap(null);
    }
    MarkerStartNEnd = [];
}

function placeMarker(location, ID) {
    var containerPixel = overlay.getProjection().fromLatLngToContainerPixel(location);
    var divPixel = overlay.getProjection().fromLatLngToDivPixel(location);
    $(ID).css({ top: containerPixel.y, left: containerPixel.x, 'dislay': 'block' });
}


function CreateMarker(Posi) {
    MarkerMarker = new google.maps.Marker({
        position: Posi,
        map: map,
        icon: '/images/letter_s.png',
        title: "Marked position"
    });
    var longi = Posi.B;
    var lati = Posi.k;



    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(MarkerMarker, 'click', function () {
        //infowindow.setContent("Marked position: latitude: " + lati + " longitude: " + longi + "<input type='text' id='txtCustomName'/>" +
        //    "<input type='time' id='txtFavoriteTime'/></br><input type='button' value='Save Location' onclick='SaveUserLocation(" + lati + "," + longi + ")'/>");

        $("#btnaddFavorite").attr('onclick', 'SaveUserLocation(' + lati + "," + longi + ')');
        //<a href="#myPopup" data-rel="popup" class="ui-btn ui-btn-inline ui-corner-all">Show Popup</a>

        //  testfunc();
        $("#myPopup").popup("open", { transition: "turn" });
        //infowindow.open(map, MarkerMarker);

        placeMarker(MarkerMarker.getPosition(), '#tooltip');
    });
}

function testfunc() {
    alert("3");
    $("#btnpopup").trigger("click");
    //$("#myPopup").popup("open");
}
function SaveUserLocation(late, longi) {
    var CurrentDate = CurrentDateNTime();
    var customname = $("#txtCustomName").val();
    var FavoriteTime = $("#txtFavoriteTime").val();
    var FavLocData = {
        "Location": late + "," + longi,
        "Google_Name": 'Blank',
        "Custom_Name": customname,
        "FavoriteTime": FavoriteTime,
        "Date": CurrentDate,
        "IsActive=": 1
    };
    InsertFavLocation(FavLocData);
    $("#myPopup").popup("close");
    $("#txtCustomName").empty();
    $("#txtFavoriteTime").empty();
}
function getcenter() {
    map.setCenter(currentPosition);
}
function initialize(lat, lon) {
    // alert("StartLocationCheck" + StartLocationCheck);
    if (StartLocationCheck === null) {
        //  CreateMap();
        StartLocationCheck = "Started";
    }
    //  currentPosition = new google.maps.LatLng(lat, lon);
    //map = new google.maps.Map(document.getElementById('map_canvas'), {
    //    zoom: 13,
    //    center: currentPosition,
    //    mapTypeId: google.maps.MapTypeId.ROADMAP
    //});
    // directionsDisplay.setMap(map);
    //directionsDisplay.setPanel($("#instructions-content"));
    RemoveCreateTrackerMarker();

    var currentPositionMarker = new google.maps.Marker({
        position: currentPosition,
        map: map,
        title: "Current position"
    });
    MarkerStartNEnd.push(currentPositionMarker);

    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(currentPositionMarker, 'click', function () {
        infowindow.setContent("Current position: latitude: " + lat + " longitude: " + lon);
        infowindow.open(map, currentPositionMarker);
    });



}

function locError(error) {

    saysomething("Fail", "To", "Get", "The", "Location");

    //  alert("The position or the map could not be loaded.");
    switch (error.code) {
        case error.PERMISSION_DENIED:
            // x.innerHTML = "User denied the request for Geolocation."
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            // x.innerHTML = "Location information is unavailable."
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            //  x.innerHTML = "The request to get user location timed out."
            alert("The request to get user location timed ou for GPS. Calling AGPS");
            LocationByCellTower();
            break;
        case error.UNKNOWN_ERROR:
            //  x.innerHTML = "An unknown error occurred."
            alert("An unknown error occurred.");
            break;
    }
    //  initialize(27.175015, 78.042155)
}

function locSuccess(position) {
    // alert("Hottt");
    // saysomething("Got", "Location");
    GPSData = {
        "Latitude": position.coords.latitude,
        "Longitude": position.coords.longitude,
        "Accuracy": position.coords.accuracy,
        "Altitude": position.coords.altitude,
        "AltitudeAccuracy": position.coords.altitudeAccuracy,
        "Heading": position.coords.heading,
        "Speed": position.coords.speed,
        "Timestamp": position.timestamp
    };
    var gpsspeedInMiles = parseFloat(position.coords.speed).toFixed(2);
    var gpsspeedInKm = gpsspeedInMiles * 3.6;
    $("#ShowPureCurrentSpeed").html(gpsspeedInKm);
    currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    initialize(position.coords.latitude, position.coords.longitude);
    
    autostart();
}


function SpeakRelease() {
    // alert("SpeakRelease");
    //  media.stop();
    media.release();
}

function mediaError(e) {
    alert('Media Error');
    alert(JSON.stringify(e));

    switch (e.MediaError) {
        case MediaError.MEDIA_ERR_ABORTED:
            alert("MEDIA_ERR_ABORTED.");
            break;
        case MediaError.MEDIA_ERR_NETWORK:
            alert("MEDIA_ERR_ABORTED.");
            break;
        case MediaError.MEDIA_ERR_DECODE:
            alert("MEDIA_ERR_ABORTED.");
            break;
        case MediaError.MEDIA_ERR_NONE_SUPPORTED:
            alert("MEDIA_ERR_ABORTED.");
            break;
    }
}
$(document).ready(function () {
    // navigator.geolocation.getCurrentPosition(locSuccess, locError);

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
             locSuccess,
             locError, {
                 //timeout: 5000,
                 //maximumAge: 3000,
                 //enableHighAccuracy: true
                 enableHighAccuracy: true,
                 timeout: 20000,
                 maximumAge: 18000000
             }
         );
    } else {
        alert("Geolocation is not supported by this browser.")
    }
   // currentPosition = new google.maps.LatLng(28.610803, 77.260838);
    $("#btnGetDirections").click(function () {

        if ($("#target-dest").val() != "") {
            targetDestination = $("#target-dest").val();
        }
        if (currentPosition && currentPosition != '' && targetDestination && targetDestination != '') {
            var request = {
                origin: currentPosition,
                destination: targetDestination,
                travelMode: google.maps.DirectionsTravelMode["DRIVING"],
                unitSystem: google.maps.UnitSystem.METRIC
                //provideRouteAlternatives: true,
                //optimizeWaypoints: false
            };

            directionsService.route(request, function (response, status) {
                //if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setPanel(document.getElementById("instructions-content"));

                    var routePath = response.routes[0].overview_path;
                    for (var a = 0; a < routePath.length; a++) {
                        // Your vector layer to render points with line
                    }
                    directionsDisplay.setDirections(response);

                    $('#distance').html(response.routes[0].legs[0].distance.text);
                    $('#duration').html(response.routes[0].legs[0].duration.text);
                    // For debuging reasons uncomment
                    /*
                    var myRoute = response.routes[0].legs[0];
                    for (var i = 0; i < myRoute.steps.length; i++) {
                      alert(myRoute.steps[i].instructions);
                    }*/

                    CalcSpeed();
                //}
            });
        }
        else {
            alert("The target destination is empty or the current position could not be located.");
        }
    });

});
$("#GoogleImages").click( function(){
    var testimage = $("#map_canvas img");
});



function autostart() {
    var gpsspeedInMiles = parseFloat(GPSData.Speed).toFixed(2);
    var gpsspeedInKm = gpsspeedInMiles * 3.6;
    if (gpsspeedInKm > 1 && targetDestination != "" && $("#target_Time").val() != "") {
        if (AutoStartBlocker != "Block") {
            $("#btnStartTimer").trigger("click");
            AutoStartBlocker = "Block";
        }
    }
}