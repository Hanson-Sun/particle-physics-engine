const Vector2D = pphys.utils.Vector2D,
      Particle = pphys.core.Particle,
      World = pphys.core.World,
      WallBoundary = pphys.walls.WallBoundary,
      Collision = pphys.behaviors.Collision,
      InputHandler = pphys.utils.InputHandler,
      Drag = pphys.behaviors.Drag,
      PenaltyCollision = pphys.behaviors.PenaltyCollision,
      Pressure = pphys.behaviors.Pressure,
      Viscosity = pphys.behaviors.Viscosity;

const canvas = document.getElementById("test");
const width = 700;
const height = 700;
const c = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const world = new World(canvas, width, height, 40, 40, 0.025, 1, 20);
const handler = new InputHandler(world);

handler.startMouseHandling();
handler.startKeyHandling();

const pos = new Vector2D(600, 100);
const vel = new Vector2D(0, 0);


const mag = 0.5;
const mass = 10;
const bounce = 0.95;


for (let i = 0; i < 4000; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 50, (height/11) * Math.random() + 25);
    let part = new Particle(p, v, mass, 1, bounce, 0);
    world.addParticle(part);
    part.addNearBehavior(new Pressure(10, 30, 3, 90, true));
    part.addNearBehavior(new Viscosity(10, 0.7, 0.5));
}

let radius = 11;
const pt = new Particle(pos, vel, mass * 10, radius, bounce, 0);
pt.addNearBehavior(new PenaltyCollision(1500));
world.addParticle(pt);


world.enableGravity(4);
world.addWall(new WallBoundary(50, 130, width, 100));
world.addWall(new WallBoundary(0, 250, width - 80, 320));
world.addWall(new WallBoundary(350, 290, 350, 278));
world.addWall(new WallBoundary(300, 480, width, 400));
world.addWall(new WallBoundary(0, 400, 280, 480));
world.addWall(new WallBoundary(280, 480, 280, 505));
world.addWall(new WallBoundary(300, 480, 300, 505));

//world.enableCollisions();

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