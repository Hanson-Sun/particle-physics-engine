// import path from 'path';

// export default {
//   entry: './testFile.js',
//   output: {
//     filename: 'bundle.js'
//   },
//   mode: 'none', // Set mode to 'development' or 'none'
// };



const path = require('path');

module.exports = {
    entry: {
        "engine":"./testFile.js"
    },
  output: {
    library: 'Engine',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
    filename: 'bundle.js',
  },
  mode: 'none',
};