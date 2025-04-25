const path = require('path');

module.exports = {
  entry: './sketch.js', // Your main entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development', // Use 'production' for optimized builds
  devtool: 'inline-source-map', // Optional: helps with debugging
  experiments: {
    // Optional: If needed for top-level await or other features
    // topLevelAwait: true
  },
  // Optional: Add loaders if needed (e.g., for Babel)
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       exclude: /node_modules/,
  //       use: {
  //         loader: 'babel-loader',
  //         options: {
  //           presets: ['@babel/preset-env']
  //         }
  //       }
  //     }
  //   ]
  // }
}; 