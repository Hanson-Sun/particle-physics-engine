/**
 * Node module encapsulation and export for entire physics engine
 */

const pphys = module.exports;

pphys.utils = require("../utils/utils");
pphys.constraints = require("../constraints/constraints");
pphys.walls = require("../walls/walls");
pphys.core = require("../core/core");
pphys.behaviors = require("../behaviors/behaviors");
pphys.renderers = require("../renderers/renderers");



