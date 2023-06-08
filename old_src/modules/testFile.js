




// const req1 = require("./folder1/req1")
// const req2 = require("./folder1/req2")
// const req3 = require("./folder2/req3")
// const req4 = require("./folder2/req4")

// import {req1} from "./folder1/req1.js"
// import {req2} from "./folder1/req2.js"
// import {req3} from "./folder2/req3.js"
// import {req4} from "./folder2/req4.js"

var Engine = module.exports;

Engine.req1 = require("./folder1/req1");
Engine.req2 = require("./folder1/req2");
Engine.req3 = require("./folder2/req3");
Engine.req4 = require("./folder2/req4");

// dont run this.. this is for bundling stuff only
// window.req1 = Engine.req1;
// window.req2 = Engine.req2;
// window.req3 = Engine.req3;
// window.req4 = Engine.req4;

// window.Engine = Engine;

