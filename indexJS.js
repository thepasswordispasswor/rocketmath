var p = {
	type: "add",
	displayType() {switch(this.type) { case "mult":return "Multiplication";case "add":return "Addition"; }},
	displayPart() {switch(this.type) { case "mult":return "Factor";case "add":return "Summand"; }},
	problem: {},
	right: 0,
	wrong: 0,
	max: 9,
	min: 1,
	time: 1200,
	timeMax: 1200,
	step: 20,
	displayTime() { return Math.ceil(this.time/this.step) },
	running: false,
	anim: 0,
}

function Problem(type, part1, answer, part2 = undefined) {
	switch(type) {
		case "mult":
			this.answer = answer;
			this.part1 = part1;
			this.part2 = (part2 === undefined) ? answer/part1:part2;
			this.type = type;
			this.op = "*";
			break;
		case "add":
			this.answer = answer;
			this.part1 = part1;
			this.part2 = (part2 === undefined) ? answer-part1:part2;
			this.type = type;
			this.op = "+";
			break;
	}
	this.check = function(input) {
		if(this.answer == input) return true;
		return false;
	};
}

function multProblem(max, min) {
	let list = [];
	let values = [];
	let factor, product, problem;
	for(var i = min; i <= max; i++) {
		for(var o = min; o <= max; o++) {
			if(values.includes(i*o) && list[values.indexOf(i*o)].product === i*o) {
				list[values.indexOf(i*o)].factorpairs.push([i,o]);
				continue;
			}
			values.push(i*o);
			list.push({product: i*o, factorpairs: [[i,o]]})
		}
	}
	problem = list[Math.floor(Math.random()*list.length)];
	product = problem.product;
	factor = problem.factorpairs[Math.floor(Math.random()*problem.factorpairs.length)][(Math.random() > 0.5)?0:1];
	return new Problem("mult", factor, product);
}

function addProblem(max, min) {
	let sum = Math.max(2,2*min)+Math.floor(Math.random()*(max*2+1-Math.max(2,2*min)));
	let summand = Math.max(min, sum-max) + Math.floor(Math.random() * Math.min(sum-(2*min), 0-sum+(2*max)));
	return new Problem("add", summand, sum);
}

function newProblem(type, max, min) {
	switch(type) {
		case "mult":
			return multProblem(max, min);
			break;
		case "add":
			return addProblem(max, min);
			break;
	}
}

function tick() {
	if(p.running) {
		p.time -= 1;
		max.disabled = "true";
		min.disabled = "true";
		type.disabled = "true";
	}
	if(p.time <= 0) {
		input.disabled = "true";
		input.value = "";
		indicator.style.backgroundColor = "white";
		p.running = false;
	}
	if(p.max !== max.value) {p.max = max.value;generate(p.type, p.max, p.min);}
	document.getElementsByClassName("option").item(0).innerHTML = "Minimum " + p.displayPart() + ":";
	if(p.min !== min.value) {p.min = min.value;generate(p.type, p.max, p.min);}
	document.getElementsByClassName("option").item(1).innerHTML = "Maximum " + p.displayPart() + ":";
	timer.value = p.time/p.timeMax*100;
	type.innerHTML = "Type: " + p.displayType();
	stats.innerHTML = `
	Right: ${p.right}<br>
	Wrong: ${p.wrong}<br>
	Timer: ${p.displayTime()}`;
	display.innerHTML = p.problem.part1 + " " + p.problem.op + " " + p.problem.part2 + " = ?";
}

document.onkeypress = function (e) {
	e = e || window.event;
		if(e.key === "Enter" && input.value !== "") {
		correct(p.problem, input);
		generate(p.type, p.max, p.min);
		if(!p.running) p.running = true;
	}
};

function correct(correcting, correctFrom) {
	if(correcting.check(correctFrom.value)) {
		p.right++;
		indicator.classList.add("right");
		p.anim = setTimeout(function(){ indicator.classList.remove("right"); },500);
	} else {
		p.wrong++;
		indicator.classList.add("wrong");
        	p.anim = setTimeout(function(){ indicator.classList.remove("wrong"); }, 500);
	}
}

function generate(type, max, min) {
	p.problem = newProblem(type, max, min);
	input.value = "";
}

function restart() {
	generate(p.type, p.max, p.min);
	p.time = p.timeMax;
	p.right = 0;
	p.wrong = 0;
	p.running = false;
	input.removeAttribute("disabled");
	max.removeAttribute("disabled");
	min.removeAttribute("disabled");
	type.removeAttribute("disabled");
	indicator.style.backgroundColor = "white";
}

function changeType() {
	switch(p.type) {
		case "add":
			p.type = "mult";
			break;
		case "mult":
			p.type = "add";
			break;
	}
	generate(p.type, p.max, p.min);
}

var container = document.getElementById("container");
var display = document.getElementById("display");
var input = document.getElementById("input");
var indicator = document.getElementById("indicator");
var timer = document.getElementById("timer");
var stats = document.getElementById("stats");
var max = document.getElementById("max");
var min = document.getElementById("min");
var type = document.getElementById("type");
type.onmousedown = changeType;
var reset = document.getElementById("reset");
reset.onmousedown = restart;

generate(p.type, p.max, p.min);
indicator.style.backgroundColor = "white";
tick();
setInterval(tick, 1000/p.step);
