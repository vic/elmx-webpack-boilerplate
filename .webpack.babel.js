import { default as w, optimize as oz } from 'webpack';
import { join } from 'path';
import { writeFileSync } from 'fs';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CleanPlugin from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const entry = {
  vendor: './src/vendor.js',
  index: './src/index.js'
};

const clientOutput = {
  path: join(__dirname, 'dist'),
  filename: '[hash]-[name].js',
  pathinfo: true,
  publicPath: ''
};

const preLoaders = [
  {
    test: /\.elm$/,
    loader: 'elmx-webpack-preloader',
    include: [join(__dirname, "src/elm")],
    query: {
      sourceDirectories: [join(__dirname, "src/elm")],
      outputDirectory: '.tmp/elm'
    }
  },
]

const loaders = [
  {
    test: /\.elm$/,
    loader: 'elm-webpack',
    include: [join(__dirname, "src/elm"), join(__dirname, ".tmp/elm")]
  },
  {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    include: [join(__dirname, "src/js")],
    query: {
      cacheDirectory: true
    }
  },
  { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css") },
  {
    test: /\.s[ac]ss$/,
    loader: ExtractTextPlugin.extract(
      "style",
      "css?sourceMap!sass?sourceMap"
    )
  },
  { test: /\.(jpe?g|png|gif|svg)$/, loader: "file" }
];

const productionMinify = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  collapseWhitespace: true,
  conservativeCollapse: false,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeRedundantAttributes: true,
  preventAttributesEscaping: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true
};

const commonPlugins = [
  new CopyPlugin([
    {from: 'src/img', to: 'img'}
  ]),
  new ExtractTextPlugin('[hash]-[name].css'),
  new w.ResolverPlugin(
    new w.ResolverPlugin.DirectoryDescriptionFilePlugin('package.json', ['main'])
  ),
  new w.ResolverPlugin(
    new w.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
  ),
  new oz.CommonsChunkPlugin(
    'vendor', '[hash]-[name].js', Infinity
  ),
  new HtmlWebpackPlugin({
    inject: false,
    title: 'Elmx',
    template: './src/index.html',
    minify: productionMinify,
    chunks: ['index', 'vendor']
  }),
]

const productionPlugins = [
  ...commonPlugins,
  new oz.DedupePlugin(),
  new oz.OccurrenceOrderPlugin(),
  new oz.UglifyJsPlugin({
    compressor: { screw_ie8: true, warnings: false }
  }),
  new oz.AggressiveMergingPlugin()
];

const developPlugins = [...commonPlugins];
const envPlugins = developPlugins;

const devServer = {
  port: 8800,
  progress: true,
  contentBase: 'dist/',
  historyApiFallback: {index: '/'},
  stats: { colors: true }
}

export default {
  devServer,
  entry,
  output: clientOutput,
  module: { preLoaders, loaders, noParse: /\.elmx?$/ },
  externals: {
    'tether': 'Tether'
  },
  resolve: {
    root: [
      join(__dirname, 'node_modules'),
      join(__dirname, 'bower_components'),
      join(__dirname, 'src/js'),
    ],
    alias: {
      config: join(__dirname, 'src/js/config', process.env.NODE_ENV || 'devel')
    }
  },
  plugins: [
    new w.DefinePlugin({
      CLIENT: 'true'
    }),
    ...envPlugins,
    function() {
      this.plugin('done', result =>
                  writeFileSync(
                    join(__dirname, 'hashes.json'),
                    JSON.stringify(result.toJson().assetsByChunkName)
                  ));
    }
  ],
};
