var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var btnRandomGen = document.getElementById("btnRandomGen");
var btnClear = document.getElementById("btnClear");
var divStats = document.getElementById("divStats");

var randomGenInterval;
var num = 20;

// draw line
drawLine();

// ranged from 0 to 1
function Point(x, y) {
	this.x = x;
	this.y = y;
}

function PointCollection() {
	// an array to hold the points in order of least-recent to most-recent
	this.currPoints = [];

	this.stats = new CollectionStats();

	this.insert = function(point) {
		this.currPoints.push(point);
		this.updateStats(point);
		this.writeStats();
	}

	this.updateStats = function(point) {
		this.stats.minX = Math.min(this.stats.minX, point.x);
		this.stats.minY = Math.min(this.stats.minY, point.y);
		this.stats.maxX = Math.max(this.stats.maxX, point.x);
		this.stats.maxY = Math.max(this.stats.maxY, point.y);

		this.stats.rangeX = this.stats.maxX - this.stats.minX;
		this.stats.rangeY = this.stats.maxY - this.stats.minY;
	}

	this.writeStats = function() {
		divStats.innerHTML = "";
		for (key in this.stats) {
			divStats.innerHTML += key + " : " + this.stats[key] + "<br />";
		}

	}
}

// an object to contain the results of statistical analysis on a PointCollection.
function CollectionStats() {
	this.minX = canvas.width;
	this.minY = canvas.height;
	this.maxX = 0;
	this.maxY = 0;
}

var pointCollection = new PointCollection();
var points = 0;


// http://stackoverflow.com/a/18053642
// I will probably add a plain addpoint(x, y) for drawpoint and drawRandPoint.
function addPoint(x, y) {
	pointCollection.insert(new Point(x, y));
	ctx.fillRect(x, y, 5, 5);

	points++;
}

function drawPoint(event) {
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	addPoint(x, y);
	btnRandomGen.disabled = true;

	if (points == num) {
		canvas.removeEventListener('click', drawPoint);

	}

	console.log("Add point at " + x + ", " + y + "\n");
}

function addRandPoint() {
	var x = Math.random() * canvas.width;
	var y = Math.random() * canvas.height;

	addPoint(x, y);

	if (randomGenInterval && points == num) {
		clearInterval(randomGenInterval);
	}

	console.log("Add point at " + x + ", " + y + "\n");
}

function randomFill() {
	randomGenInterval = setInterval(addRandPoint, 200);

	btnRandomGen.disabled = true;
	canvas.removeEventListener('click', drawPoint);
}


function clear() {
	pointCollection = new PointCollection();
	divStats.innerHTML = "";
	points = 0;

	canvas.addEventListener('click', drawPoint, false);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	console.log("Delete points\n");

	btnRandomGen.disabled = false;
}

function drawLine() {
	ctx.beginPath();
	ctx.moveTo(0, 30);
	ctx.lineTo(600, 30);
	ctx.stroke();
}

canvas.addEventListener('click', drawPoint, false);
btnRandomGen.addEventListener('click', randomFill, false);
btnClear.addEventListener('click', clear, false);