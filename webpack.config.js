const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

console.log(JSON.stringify(process.env.TESTRPC_URL || 'http://127.0.0.1:8545'));

module.exports = {
	entry: './app/javascripts/app.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'app.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.TESTRPC_URL': JSON.stringify(process.env.TESTRPC_URL || 'http://127.0.0.1:8545')
		}),
		// Copy our app's index.html to the build folder.
		new CopyWebpackPlugin([
			// { from: './app/index.html', to: "index.html" },
			// { from: './app/img', to: "img" },
			// { from: './app/stylesheets/fonts', to: "stylesheets/fonts" },
			// { from: './app/fonts', to: "fonts" }
			{ from: './app' }
		]),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
					plugins: ['transform-runtime']
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			// ],
			// loaders: [
			{ test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader" },
			{ test: /\.json$/, use: 'json-loader' },

			{ test: /\.(png|jpg|jpeg|gif|svg)$/, loader: "url-loader?limit=100000" },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
			{ test: /\.(otf|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: { loader: 'html-loader?interpolate' }
			}
		]
	}
}
