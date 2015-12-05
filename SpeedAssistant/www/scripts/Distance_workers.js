self.addEventListener("message", function (e) {
    var i = 0;
    function timedCount1() {
        i = i + 1;
        postMessage(i);
        setTimeout(timedCount1, e.data.Duration);
    }
    timedCount1();
}, false);

