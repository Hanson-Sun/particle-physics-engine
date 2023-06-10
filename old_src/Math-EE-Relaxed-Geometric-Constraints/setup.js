print = console.log;
canvas = document.getElementById("test");
const c = canvas.getContext("2d");

c.lineWidth = 2;
var cl = [];
var spjoint = [];
var stiffjoint = [];
var data = [];
var timestep = parseFloat(document.getElementById("timestep").value);
var maxforce = parseFloat(document.getElementById("maxforce").value);
var breakforce = Infinity;
var visc = parseFloat(document.getElementById("Drag").value);
var radius = 20;
var mass = 80;
var bouncyness = 1;
var charge = 0;
var grav = parseFloat(document.getElementById("gravity").value);
var genamount = 0;
var width = parseFloat(document.getElementById("width").value);
var height = parseFloat(document.getElementById("height").value);
canvas.width = width;
canvas.height = height;
var gravity = new Vector2D(0, grav);
var wind = new Vector2D(0, 0);
var iterations = parseFloat(document.getElementById("steps").value);;
var constraintsIter = parseFloat(document.getElementById("constraintsIter").value);
var count = 0;
var time = 0;
var simulation = document.getElementById("simulation").value;
var clock = document.getElementById("time");

function checksim() {
	type = document.getElementById("simulation").value;
	if (type == "cloth") {
		document.getElementById("startsim").checked = false;
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		runsim = false;
		applychanges();
		cl = []
		spjoint = [];
		stiffjoint = [];
		time = 0;
		count = 0;		
		clock.innerHTML = 0;
		gencloth();

	} else if (type == "truss") {
		document.getElementById("stiffness").value = 1;
		document.getElementById("startsim").checked = false;
		runsim = false;
		applychanges();
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		cl = []
		spjoint = [];
		stiffjoint = [];
		time = 0;
		count = 0;
		clock.innerHTML = 0;

		gentruss();
	} else if (type == "beam") {
		document.getElementById("stiffness").value = 1;
		document.getElementById("startsim").checked = false;
		runsim = false;
		applychanges();
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		cl = []
		spjoint = [];
		stiffjoint = [];
		time = 0;
		count = 0;
		clock.innerHTML = 0;

		genbeam();
	} else if (type == "pendulum") {
		document.getElementById("stiffness").value = 1;
		document.getElementById("startsim").checked = false;
		runsim = false;
		applychanges();
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		cl = []
		spjoint = [];
		stiffjoint = [];
		time = 0;
		count = 0;
		clock.innerHTML = 0;

		genpendulum();
	} else if (type == "doublependulum") {
		document.getElementById("Drag").value = 0;
		document.getElementById("stiffness").value = 1;
		document.getElementById("startsim").checked = false;
		runsim = false;
		applychanges();
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		cl = []
		spjoint = [];
		stiffjoint = [];
		time = 0;
		count = 0;
		clock.innerHTML = 0;

		doublependulum();
	} else if (type == "softbody") {
		document.getElementById("Drag").value = 0;
		document.getElementById("stiffness").value = 0.0008;
		document.getElementById("startsim").checked = false;
		document.getElementById("collide").checked = true;
		applychanges();
		runsim = false;
		collide = true;
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		cl = []
		spjoint = [];
		stiffjoint = [];
		time = 0;
		count = 0;
		clock.innerHTML = 0;

		softbody();
	} else if (type == "rigidbody") {
		document.getElementById("Drag").value = 0;
		document.getElementById("stiffness").value = 1;
		document.getElementById("startsim").checked = false;
		document.getElementById("collide").checked = true;
		applychanges();
		runsim = false;
		collide = true;
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		cl = []
		spjoint = [];
		stiffjoint = [];
		time = 0;
		count = 0;
		clock.innerHTML = 0;

		rigidbody();
	} else if (type == "cradle") {
		document.getElementById("Drag").value = 0;
		document.getElementById("stiffness").value = 0.9;
		document.getElementById("startsim").checked = false;
		document.getElementById("collide").checked = true;
		applychanges();
		runsim = false;
		collide = true;
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		cl = []
		spjoint = [];
		stiffjoint = [];
		time = 0;
		count = 0;
		clock.innerHTML = 0;

		cradle();
	}else if (type == "spring") {
		document.getElementById("Drag").value = 0;
		document.getElementById("stiffness").value = 0.000001;
		document.getElementById("constraintsIter").value = 10;
		document.getElementById("startsim").checked = false;
		//document.getElementById("collide").checked = true;
		applychanges();
		runsim = false;
		collide = true;
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		cl = []
		spjoint = [];
		stiffjoint = [];
		time = 0;
		count = 0;
		clock.innerHTML = 0;

		spring();
	}


}

checksim();

function applychanges() {
	iterations = parseFloat(document.getElementById("steps").value);
	visc = parseFloat(document.getElementById("Drag").value);
	grav = parseFloat(document.getElementById("gravity").value);
	constraintsIter = parseFloat(document.getElementById("constraintsIter").value);
	gravity = new Vector2D(0, grav);
	timestep = parseFloat(document.getElementById("timestep").value);
	maxforce = parseFloat(document.getElementById("maxforce").value);
	width = parseFloat(document.getElementById("width").value);
	height = parseFloat(document.getElementById("height").value);
	stiffness = parseFloat(document.getElementById("stiffness").value);

	for (j of stiffjoint) {
		j.stiffness = stiffness;
	}
	for (j of spjoint) {
		j.stiffness = stiffness;
	}
	canvas.width = width;
	canvas.height = height;

	//checksim();
}


var key = false;
window.addEventListener('keydown', function (e) {
	key = e.keyCode;
	if (key == 9) {
		cl.pop();
	} else if (key == 46) {
		cl = [];
	}
})
window.addEventListener('keyup', function (e) {
	key = false;
})

var startmouse = { x: 0, y: 0 };
endmouse = { x: 0, y: 0 };
mouseisdown = false;
hold = false;
var currentcirc;

function getMousePos(c, evt) {
	var rect = c.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

canvas.addEventListener("mousedown", function (event) {


});
canvas.addEventListener("mousedown", function (event) {
	var oldmousePos = getMousePos(canvas, event);
	startmouse.x = oldmousePos.x;
	startmouse.y = oldmousePos.y;
	mouseisdown = true;
	mouseVect = new Vector2D(startmouse.x, startmouse.y);

	for (circ of cl) {
		if (circ.radius < 2) {
			if ((circ.pos.sub(mouseVect)).mag() <= circ.radius * 10 * (3 - circ.radius)) {

				hold = true;


				currentcirc = circ;
			}
		} else if (circ.radius >= 2) {
			if ((circ.pos.sub(mouseVect)).mag() <= circ.radius) {

				hold = true;

				currentcirc = circ;
			}
		}
	}
	console.log(event.detail, event.button)
	if (event.button === 2) {
		for (circ of cl) {
			if (circ.radius < 2) {
				if ((circ.pos.sub(mouseVect)).mag() <= circ.radius * 10 * (3 - circ.radius)) {

					for (j of stiffjoint) {
						if (j.c1 == circ || j.c2 == circ) {
							index = stiffjoint.indexOf(j);
							if (index > -1) {
								stiffjoint.splice(index, 1);
							}
						}
					}

					index = cl.indexOf(circ);
					if (index > -1) {
						cl.splice(index, 1);
					}

				}
			} else {
				if ((circ.pos.sub(mouseVect)).mag() <= circ.radius) {
					remove = []
					for (j of stiffjoint) {
						if (j.c1 == circ || j.c2 == circ) {
							remove.push(j)
						}
					}
					for (j of remove) {
						index = stiffjoint.indexOf(j);
						if (index > -1) {
							stiffjoint.splice(index, 1);
						}
					}
					index = cl.indexOf(circ);
					if (index > -1) {
						cl.splice(index, 1);
					}
				}
			}
		}
	}
	if (event.detail === 2) {
		for (circ of cl) {
			if (circ.radius < 2) {
				if ((circ.pos.sub(mouseVect)).mag() <= circ.radius * 10 * (3 - circ.radius)) {
					circ.ispivot = !circ.ispivot;
				}
			} else {
				if ((circ.pos.sub(mouseVect)).mag() <= circ.radius) {
					circ.ispivot = !circ.ispivot;
				}
			}
		}
	}





}, false);


canvas.addEventListener("mousemove", function (evt) {

	var mousePos = getMousePos(canvas, evt);

	if (hold === true) {
		currentcirc.pos = new Vector2D(mousePos.x, mousePos.y);
		currentcirc.vel = new Vector2D((mousePos.x - endmouse.x) / timestep / iterations, (mousePos.y - endmouse.y) / timestep / iterations);
	}

	endmouse.x = mousePos.x;
	endmouse.y = mousePos.y;




}, false);

canvas.addEventListener("mouseup", function (evt) {
	var newmousePos = getMousePos(canvas, evt);
	endmouse.x = newmousePos.x;
	endmouse.y = newmousePos.y;


	if (hold === false) {
		vx = (startmouse.x - endmouse.x) / 10 / timestep / iterations;
		vy = (startmouse.y - endmouse.y) / 10 / timestep / iterations;

		p = new Vector2D(startmouse.x, startmouse.y);
		v = new Vector2D(vx, vy)

		new circle(cl, p, v, mass, charge, radius, bouncyness, "green");



	} else {
		currentcirc.pos = new Vector2D(endmouse.x, endmouse.y);

		hold = false;
		currentcirc = null;
	}
	if (mouseisdown == true && hold == false) {
		if (evt.button == 1) {
			c.beginPath();
			c.arc(startmouse.x, startmouse.y, radius, 0, Math.PI * 2, false);
			c.strokeStyle = "green";
			c.fillStyle = "green";
			c.fill();
			c.stroke();
			c.beginPath();
			c.moveTo(startmouse.x, startmouse.y);
			c.lineTo(endmouse.x, endmouse.y);
			c.stroke();
		}

	}

	mouseisdown = false;
}, false);


function clear() {
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}


function generate() {
	vell = new Vector2D(0, 0);
	genamount = parseFloat(document.getElementById("generate").value);
	for (i = 0; i < genamount; i++) {
		p = new Vector2D((width - radius) * Math.random(), (height - radius) * Math.random());
		new circle(cl, p, vell, mass, charge, radius, bouncyness, "black");
	}
}

runsim = false;

function start() {
	var checkBox = document.getElementById("startsim");

	// If the checkbox is checked, display the output text
	if (checkBox.checked == true) {
		runsim = true;
	} else {
		runsim = false;
	}

}

collide = false;

function collideCheck() {
	var checkBox = document.getElementById("collide");

	// If the checkbox is checked, display the output text
	if (checkBox.checked == true) {
		collide = true;
	} else {
		collide = false;
	}
}