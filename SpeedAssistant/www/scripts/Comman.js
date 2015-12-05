function CurrentDateNTime() {
    var fullDate = new Date()
    //Thu May 19 2011 17:25:38 GMT+1000 {}
    //convert month to 2 digits   
    var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
    var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear() + " " + fullDate.getHours() + ":" + fullDate.getMinutes();
    return currentDate;
    //19/05/2011 14:25
}

function CurrentTime() {
    var fullDate = new Date()
    var currentTime = fullDate.getHours() + ":" + fullDate.getMinutes() + ":" + fullDate.getSeconds();
    return currentTime;
    //19/05/2011 14:25:00
}

function TimeDifference(start_time, end_time) {

    if (Date.parse('01/01/2011 ' + end_time) > Date.parse('01/01/2011 ' + start_time)) {
        var diff = (new Date("1970-1-1 " + end_time) - new Date("1970-1-1 " + start_time)) / 1000;// / 1000 / 60 / 60;
        return diff;
    }
    else {
        alert("You are already late :(");
    }
}


function saysomething() {
    try {

        var speechstring = "";
        for (var i = 0; i < arguments.length; i++) {
            //  audio.src = 'http://translate.google.com/translate_tts?ie=utf-8&tl=en&q=Distance%2029%20Kilometer.';
            speechstring = speechstring + arguments[i] + "%20";
        }
        if (G_Ripple === true) {
            // audio.src = 'http://translate.google.com/translate_tts?ie=utf-8&tl=en&q=' + speechstring + '.';
            //audio.play();
        }
        else {
            media = new Media('http://translate.google.com/translate_tts?ie=utf-8&tl=en&q=' + speechstring + '.', null
                //    function onSuccess() {
                        // release the media resource once finished playing
                     //   media.release();
               //     },
                  //   mediaError
        );
            // var dur = media.getDuration();
            // alert("Media Duration" + dur);
            // media.setVolume('1.0');
            media.play();
        }
        // setTimeout(SpeakRelease, 5000);
    }
    catch (err) {
        InAppLog("Catch>saysomething> " + err.message);
    }
}

function Dummy() {
    try {

    }
    catch (err) {
        InAppLog("Catch>");
    }
    finally {

    }
}

function InAppLog(msg) {
    $("#ulAppLog").append("<li>" + msg + "</li>");

}