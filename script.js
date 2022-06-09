var selected_hero = null;

/**
 * Self-adjusting interval to account for drifting
 * 
 * @param {function} workFunc  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds)
 * @param {function} errorFunc (Optional) Callback to run if the drift
 *                             exceeds interval
 */
var logs = 0;
var ores = 0;

function AdjustingInterval (workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }
    
	this.setResourceType = (type) => {this.resourceType = type}

    step = () => {
	tick()
	var drift = Date.now() - expected;
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}

// For testing purposes, we'll just increment
// this and send it out to the console.
var justSomeNumber = 0;

// Define the work to be done
var tick = () => {
	if (ticker.resourceType == "logs"){
		logs += 1
		}else {
		ores += 1
	}

	$("#show-logs").text(logs)
	$("#show-ores").text(ores)
};

// Define what to do if something goes wrong
var doError = function() {
    console.warn('The drift exceeded the interval.');
};

// (The third argument is optional)
var ticker = new AdjustingInterval(tick, 1000, doError);

collect_resources = () => {}

ticker.start();

stop_collecting = () => {
	ticker.stop();	
}

$(document).ready(() => {
$("#logs-button").click(() => ticker.setResourceType("logs"));
$("#ores-button").click(() => ticker.setResourceType("ores"));
})
