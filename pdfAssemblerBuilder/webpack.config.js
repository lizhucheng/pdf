const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './index.js'),
  output: {
    path: __dirname,
    filename: 'pdf-assembler.[hash:8].js',
  },
}