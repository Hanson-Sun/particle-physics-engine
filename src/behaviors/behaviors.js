/**
 * Node module export for the the behaviors directory.
 */

const behaviors = module.exports;

behaviors.ChargeInteraction = require("./ChargeInteraction");
behaviors.Collision = require("./Collision");
behaviors.PenaltyCollision = require("./PenaltyCollision");
behaviors.Drag = require("./Drag");
behaviors.Force = require("./Force");
behaviors.Gravity = require("./Gravity");
behaviors.PositionLock = require("./PositionLock");
behaviors.NearBehavior = require("./NearBehavior");
behaviors.SelfBehavior = require("./SelfBehavior");
behaviors.Pressure = require("./Pressure");