const Vector2D = pphys.utils.Vector2D,
      Particle = pphys.core.Particle,
      World = pphys.core.World,
      ForceDistanceConstraint = pphys.constraints.ForceDistanceConstraint,
      PositionPivotConstraint = pphys.constraints.PositionPivotConstraint,
      WallBoundary = pphys.walls.WallBoundary,
      Collision = pphys.behaviors.Collision,
      ConstraintRenderer = pphys.renderers.ConstraintRenderer,
      InputHandler = pphys.utils.InputHandler,
      Drag = pphys.behaviors.Drag,
      ChargeInteraction = pphys.behaviors.ChargeInteraction,
      ForcePivotConstraint = pphys.constraints.ForcePivotConstraint, 
      PositionDistanceConstraint = pphys.constraints.PositionDistanceConstraint,
      PenaltyCollision = pphys.behaviors.PenaltyCollision,
      PositionLock = pphys.behaviors.PositionLock;

const canvas = document.getElementById("test");
const width = 700;
const height = 700;
const c = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const world = new World(canvas, width, height, 40, 40, 0.0005, 100, 20);
const handler = new InputHandler(world);

handler.startMouseHandling();
handler.startKeyHandling();


cradle(250, 250)

world.enableGravity(15);
world.enableCollisions();

function cradle(w, h) {
    let v = new Vector2D(0, 0);
    let p2 = new Vector2D(w - 21, h);
    let p4 = new Vector2D(w - 21 - 100, h);
    let stiffness = 1;
    let length = 100;
    let mass = 10;
    let pivotMass = 100000;

    let circ3 = new Particle(p2, v, pivotMass, 1, 1);
    let circ4 = new Particle(p4, v, mass, 10, 1);
    circ3.addSelfBehavior(new PositionLock(circ3.pos));
    world.addParticle(circ3);
    world.addParticle(circ4);

    world.addConstraint(new PositionDistanceConstraint(circ3, circ4, length, stiffness));
    for (let i = 0; i < 10; i++) {
        let p2 = new Vector2D(w + i * 21, h);
        let p4 = new Vector2D(w + i * 21, h + 100);

        circ3 = new Particle(p2, v, pivotMass, 1, 1);
        circ4 = new Particle(p4, v, mass, 10, 1);
        circ3.addSelfBehavior(new PositionLock(circ3.pos));

        world.addParticle(circ3);
        world.addParticle(circ4);

        world.addConstraint(new PositionDistanceConstraint(circ3, circ4, length, stiffness));
    }

}



setInterval(function () {
    c.lineWidth = 1;
    world.nextFrame();

    c.lineWidth = 3;
    for (let cons of world.constraints) {
        c.strokeStyle  = ConstraintRenderer.calculateStressColor(cons, 0.000002, 0, 4);
        world.renderer.constraintRenderer.draw(cons);
        c.strokeStyle  = "black"
    }
}, 1);

