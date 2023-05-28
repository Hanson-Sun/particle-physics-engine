(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Engine", [], factory);
	else if(typeof exports === 'object')
		exports["Engine"] = factory();
	else
		root["Engine"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {






// const req1 = require("./folder1/req1")
// const req2 = require("./folder1/req2")
// const req3 = require("./folder2/req3")
// const req4 = require("./folder2/req4")

// import {req1} from "./folder1/req1.js"
// import {req2} from "./folder1/req2.js"
// import {req3} from "./folder2/req3.js"
// import {req4} from "./folder2/req4.js"

var Engine = module.exports;

Engine.req1 = __webpack_require__(1);
Engine.req2 = __webpack_require__(2);
Engine.req3 = __webpack_require__(3);
Engine.req4 = __webpack_require__(4);

// dont run this.. this is for bundling stuff only
// window.req1 = Engine.req1;
// window.req2 = Engine.req2;
// window.req3 = Engine.req3;
// window.req4 = Engine.req4;

// window.Engine = Engine;



/***/ }),
/* 1 */
/***/ ((module) => {

/**
 * iaosndoiasndonasd
 */
class req1 {
    constructor() {
        this.name = "req1";
    }
}
module.exports = req1;

/***/ }),
/* 2 */
/***/ ((module) => {

class req2 {
    constructor() {
        this.name = "req2";
    }
}
module.exports = req2;

/***/ }),
/* 3 */
/***/ ((module) => {

/**
 * testing stuff to see if they keep it
 */
class req3 {
    constructor() {
        this.name = "req3";
    }
}
module.exports = req3;

/***/ }),
/* 4 */
/***/ ((module) => {

class req4 {
    constructor() {
        this.name = "req4";
    }
}

module.exports = req4;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});