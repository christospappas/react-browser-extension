const webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin');

var alias = {
  // 'react-dom': '@hot-loader/react-dom',
};

var secretsPath = path.join(__dirname, 'secrets.ts');

if (fileSystem.existsSync(secretsPath)) {
  alias['@secrets'] = secretsPath;
}

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: path.join(__dirname, "src/pages/popup/index.tsx"),
    options: path.join(__dirname, "src/pages/options/index.tsx"),
    contentScript: path.join(__dirname, "src/pages/content/index.tsx"),
    eventPage: path.join(__dirname, "src/pages/background/eventPage.ts"),
    backgroundContextMenus: path.join(__dirname, "src/pages/background/contextMenus.ts"),
  },
  target: 'web',
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.tsx', '.ts', '.js', '.css']),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: '/node_modules/',
        options: {
          getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
        }
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader?name=[name].[ext]',
        exclude: /node_modules/,
      }
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // clean the dist folder
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'dist'),
          force: true,
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/images',
          to: path.join(__dirname, 'dist')
        } 
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js'
      }]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new WriteFilePlugin({test: /^(?!.+(?:hot-update.(js|json))).+$/})
  ],
}

if (process.env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
