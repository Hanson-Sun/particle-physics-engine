const Vector2D = pphys.utils.Vector2D,
      Particle = pphys.core.Particle,
      World = pphys.core.World,
      Collision = pphys.behaviors.Collision,
      ConstraintRenderer = pphys.renderers.ConstraintRenderer,
      InputHandler = pphys.utils.InputHandler,
      Drag = pphys.behaviors.Drag,
      PenaltyCollision = pphys.behaviors.PenaltyCollision,
      Pressure = pphys.behaviors.Pressure;

const canvas = document.getElementById("test");
const width = 700;
const height = 700;
const c = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const world = new World(canvas, width, height, 40, 40, 0.05, 1, 20);
const handler = new InputHandler(world);

handler.startMouseHandling();
handler.startKeyHandling();

const pos = new Vector2D(600, 100);
const pos2 = new Vector2D(600, 400);
const pos3 = new Vector2D(600, 600);
const vel = new Vector2D(0, 0);
const vel2 = new Vector2D(0, 20);
const vel3 = new Vector2D(0, -90);

const mag = 0.5;
const mass = 10;
const bounce = 1;

for (let i = 0; i < 2000; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 25, (height - 50) * Math.random() + 25);
    let part = new Particle(p, v, mass, 1, bounce, 0);
    world.addParticle(part);
    part.addNearBehavior(new Pressure(20, 30, 10, 100, true));
}

for (let i = 0; i < 1300; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 25, (height - 50) * Math.random() + 25);
    let part = new Particle(p, v, mass, 3, bounce, 0);
    world.addParticle(part);
    part.addNearBehavior(new Pressure(35, 25, 1, 140, true));
}

let radius = 20;
const pt = new Particle(pos, vel, mass * 10, radius, bounce, 0);
pt.addNearBehavior(new PenaltyCollision(1500));
pt.addNearBehavior(new Pressure(40, 5, 0.1, 120, true));
world.addParticle(pt);
world.enableGravity(3);
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

