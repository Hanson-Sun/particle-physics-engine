const Vector2D = pphys.utils.Vector2D,
      Particle = pphys.core.Particle,
      World = pphys.core.World,
      WallBoundary = pphys.walls.WallBoundary,
      InputHandler = pphys.utils.InputHandler,
      Viscosity = pphys.behaviors.Viscosity,
      PowderForce = pphys.behaviors.PowderForce;

const canvas = document.getElementById("test");
const width = 700;
const height = 700;
const c = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const world = new World(canvas, width, height, 45, 45, 0.05, 1, 20);
const handler = new InputHandler(world);

handler.startMouseHandling();
handler.startKeyHandling();

const pos = new Vector2D(600, 100);
const vel = new Vector2D(0, 0);

const mag = 0.5;
const mass = 10;
const bounce = 0.8;
const vis = 50;
const stiffness = 1000;
const density = 0.00001;
const d = 3;


for (let i = 0; i < 1300; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 50, (height / d) * Math.random() + 25);
    let part = new Particle(p, v, mass, 2, bounce, 0);
    world.addParticle(part);
    part.addNearBehavior(new PowderForce(4, stiffness, density));
    part.addNearBehavior(new Viscosity(3, vis, 0.1));
}

for (let i = 0; i < 1000; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 50, (height / d) * Math.random() + 25);
    let part = new Particle(p, v, mass, 3, bounce, 0);
    world.addParticle(part);
    part.addNearBehavior(new PowderForce(6, stiffness, density));
    part.addNearBehavior(new Viscosity(4, vis, 0.1));
}


for (let i = 0; i < 1000; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 25, (height / d) * Math.random() + 25);
    let part = new Particle(p, v, mass, 4, bounce, 0);
    world.addParticle(part);
    part.addNearBehavior(new PowderForce(8, stiffness, density));
    part.addNearBehavior(new Viscosity(6, vis, 0.1));
}

for (let i = 0; i < 600; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 25, (height / d) * Math.random() + 25);
    let part = new Particle(p, v, mass, 5, bounce, 0);
    world.addParticle(part);
    part.addNearBehavior(new PowderForce(10, stiffness, density));
    part.addNearBehavior(new Viscosity(7, vis, 0.1));
}


let radius = 10;
const pt = new Particle(pos, vel, mass * 10, radius, bounce, 0);
pt.addNearBehavior(new PowderForce(radius * 1.4, stiffness, density));
pt.addNearBehavior(new Viscosity(radius * 1.4, vis, 0.1));
world.addParticle(pt);

let shift = 130; 
world.enableGravity(1);
world.addWall(new WallBoundary(50, 150 + shift, width, 120 + shift));
world.addWall(new WallBoundary(0, 250 + shift, width - 80, 320 + shift));
world.addWall(new WallBoundary(300, 480 + shift, width, 400 + shift));
world.addWall(new WallBoundary(0, 400 + shift, 270, 480 + shift));
world.addWall(new WallBoundary(270, 480 + shift, 270, 505 + shift));
world.addWall(new WallBoundary(300, 480 + shift, 300, 505 + shift));

world.constrainBoundary(0, width, 0, height);

setInterval(function () {
    world.nextFrame();

    for (let p of world.particles.findNear(pt)) {
        c.beginPath();
        c.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2, false);
        c.fillStyle = "blue";
        c.fill();
    }
}, 1);


