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

const world = new World(canvas, width, height, 40, 40, 0.010, 10, 1);
const handler = new InputHandler(world);

handler.startMouseHandling();
handler.startKeyHandling();

const pos = new Vector2D(600, 100);
const vel = new Vector2D(0, 0);


const mass = 1;
const bounce = 0.8;
const radius = 30;
let counter = 0;
let lastPlaced = null;

world.enableGravity(4);
world.enableCollisions();


world.addWall(new WallBoundary(50, height - 100, 7 * radius * 2 * 1.05 + 50, height - 100));
for(let i = 0; i < 8; i++) {
    world.addWall(new WallBoundary(50 + radius * 2 * 1.05 * i, height - 100, 50 + radius * 2 * 1.05 * i, height - 6 * radius * 2 * 1.05 - 100));
}

handler.mouseDownFunction = () => {
    if (handler.currentlySelectedParticle == null) {
        let color = "blue";
        if (counter % 2 == 0) {
            color = "red";
        }
        let pt = new Particle(handler.mouseDownPosition, vel, mass * 10, radius, bounce, 0, color);
        // pt.addNearBehavior(new PenaltyCollision(1000));
        world.addParticle(pt);
        counter++;
        lastPlaced = pt;
    }
}

handler.addKeyEvent(new InputHandler.KeyInput("Backspace", 
    () => {
        world.removeParticle(handler.selectedParticle);
    }, 
true))

world.constrainBoundary(0, width, 0, height);

setInterval(function () {
    world.nextFrame();

}, 1);