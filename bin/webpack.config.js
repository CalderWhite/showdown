var webpack = require("webpack");
var path = require("path")
module.exports = {
	entry: "./src/main.js",
	output: {
		path: __dirname + "/build",
		filename: "bundle.js",
	    libraryTarget: 'var',
	    library: 'EntryPoint'
	}
}