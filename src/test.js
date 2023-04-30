
// TODO: test collisions and add constraints
// also constrain boundaries.

// BRUH SOMETHING IS WRONG WITH GRAVITY --> implementation of addTo is kind of messed up
// wait why... i dont get it....

const canvas = document.getElementById("test");
const width = 500;
const height = 900;
const c = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const world = new World(canvas, width, height, 2);

const pos = new Vector2D(width/2, 50);
const vel = new Vector2D(0, 0);
const vel2 = new Vector2D(0, 0);
const vel3 = new Vector2D(0, 0);


world.addParticle(new Particle(pos, vel, 10, 50));
world.addParticle(new Particle(pos, vel2, 10, 30));
world.addParticle(new Particle(pos, vel, 10, 20));
world.enableGravity(0.01);


setInterval(function () {
	world.nextFrame();
}, 10);



