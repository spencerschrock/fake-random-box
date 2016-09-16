var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var btnRandomGen = document.getElementById("btnRandomGen");
var btnClear = document.getElementById("btnClear");
var divStats = document.getElementById("divStats");

var randomGenInterval;
var num = 20;

ctx.fillStyle = "#FF00FF"; // red points

// draw line
drawLine();

// ranged from 0 to 1
function Point(x, y) {
	this.x = x;
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
		this.stats.maxX = Math.max(this.stats.maxX, point.x);

		this.stats.rangeX = this.stats.maxX - this.stats.minX;
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
	this.maxX = 0;
}

var pointCollection = new PointCollection();
var points = 0;

function addPoint(x) {
	pointCollection.insert(new Point(x));
	ctx.fillRect(canvas.width * x - 2.5, canvas.height/2 - 2.5, 5, 5); // scale x up to width,
	points++;
}

function drawPoint(event) {
	var rect = canvas.getBoundingClientRect()
	var x = (event.clientX - rect.left)/canvas.width // scale x down to [0,1);
	addPoint(x);
	btnRandomGen.disabled = true;

	if (points == num) {
		canvas.removeEventListener('click', drawPoint);
	}
}

function addRandPoint() {
	var x = Math.random();

	addPoint(x);

	if (randomGenInterval && points == num) {
		clearInterval(randomGenInterval);
	}
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