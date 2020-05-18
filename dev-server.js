// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('./webpack.config'),
  path = require('path');

const PORT = process.env.PORT || 3001;

// define entries to exclude from hot reloading
var excludeEntriesToHotReload = ['contentScript', 'eventPage', 'backgroundContextMenus'];

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + PORT,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || []
);

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.join(__dirname, '../dist'),
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  disableHostCheck: true,
});

server.listen(PORT);