

const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');
const fs = require('fs');
const execSync = require('child_process').execSync;

module.exports = (env = {}) => {

  const minimize = env.MINIMIZE || false;
  const kind = env.KIND || null;
  const sizeThreshold = minimize ? 100 * 1024 : 512 * 1024;

  const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  const version = !kind ? pkg.version : `${pkg.version}-${kind}+${commitHash}`;
  const license = fs.readFileSync('LICENSE', 'utf8');
  const resolve = relativePath => path.resolve(__dirname, relativePath);

  const banner = 
  `${pkg.name} ${version} by @hanson-sun
  ${kind ? 'Experimental pre-release build.\n  ' : ''}${pkg.homepage}
  License ${pkg.license}${!minimize ? '\n\n' + license : ''}`;
  
  return {    
    entry:"./src/module/module.js",
    output: {
      library: 'pphys',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: 'this',
      filename: pkg.name + `${kind ? '.' + kind : ''}${minimize ? '.min' : ''}.js`,
    },
    optimization: { minimize },
    performance: {
        maxEntrypointSize: sizeThreshold,
        maxAssetSize: sizeThreshold
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new webpack.DefinePlugin({
            __MATTER_VERSION__: JSON.stringify(version),
        })
    ],
    mode: 'none',
  }
};