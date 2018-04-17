#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const chalk = require('chalk')
const log = console.log
const success = chalk.green
const warning = chalk.yellow

module.exports.generateTheme = (name, branch) => {
	// Folder where everything will be compiled to
	var options = {}
	if(name){
		options.dest = `./${name}`
		options.name = name
	}else{
		options.dest = './newTheme'
		options.name = 'theme'
	}
	if(branch !== undefined){
		options.branch = branch
	}else{
		options.branch = undefined
	}
	options.temp = './temp'

	// Remove dist and temp directories
	shell.rm('-rf', options.dest)
	shell.mkdir('-p', options.dest)
	shell.rm('-rf', options.temp)
	shell.mkdir('-p', options.temp)

	// Determine the theme list dynamically
	shell.cd('./')

	log(success("Theme starter kit 👜"))
	log(success("This script will setup a new theme repository for you so you can start working on a new website."))

	log(warning("Building a new theme"))
	if(options.branch !== undefined){
		log(warning(`Cloning version ${options.branch} of Skeletal.`))
		shell.exec(`git clone -b "${options.branch}" --depth 1 https://github.com/NetoECommerce/Skeletal.git ${options.temp}/.latestSkeletal`)
	}else{
		log(warning("No branch/tag defined, cloning latest version of Skeletal."))
		shell.exec(`git clone --depth 1 https://github.com/NetoECommerce/Skeletal.git ${options.temp}/.latestSkeletal`)
	}
	log(success("👍 Skeletal cloned!"))

	makeDir(options, function(){
		cpFiles(options, function(){
			installModules(options, function(){
				log(success(`Your new theme is located at ${options.dest}. You can go there in terminal with the command cd ${options.dest}`))
				log(success("Congratulations! You can now start working on your new theme."))
				shell.exit(1)
			})
		})
	})
}

function makeDir(options, callback){
	log(warning("Creating the required directories."))
	// Create directories for templates
	shell.mkdir('-p', `${options.dest}/src`)
	shell.mkdir('-p', `${options.dest}/src/templates`)
	shell.mkdir('-p', `${options.dest}/src/templates/headers`)
	shell.mkdir('-p', `${options.dest}/src/templates/cms`)
	shell.mkdir('-p', `${options.dest}/src/templates/footers`)
	// Create directories for assets
	shell.mkdir('-p', `${options.dest}/src/css`)
	if (fs.existsSync(`${options.temp}/.latestSkeletal/src/css/less`)) {
		shell.mkdir('-p', `${options.dest}/src/css/less`)
	}else if (fs.existsSync(`${options.temp}/.latestSkeletal/src/scss`)) {
		shell.mkdir('-p', `${options.dest}/src/scss`)
	}
	// Create Buildkite directory
	shell.mkdir('-p', `${options.dest}/.buildkite`)
	log(success("👍 Directories created!"))
	callback()
}
function cpFiles(options, callback){
	log(warning("Copying the required files from Skeletal to our new theme."))
	// Copy in some standard templates from Skeletal
	shell.cp('-r', `${options.temp}/.latestSkeletal/src/templates/headers/template.html`,`${options.dest}/src/templates/headers/`)
	shell.cp('-r', `${options.temp}/.latestSkeletal/src/templates/footers/template.html`,`${options.dest}/src/templates/footers/`)
	shell.cp('-r', `${options.temp}/.latestSkeletal/src/templates/cms/home.template.html`,`${options.dest}/src/templates/cms/`)
	shell.cp('-r', `${options.temp}/.latestSkeletal/src/templates/skeletal-netothemeinfo.txt`,`${options.dest}/src/templates/${options.name}-netothemeinfo.txt`)
	if (fs.existsSync(`${options.temp}/.latestSkeletal/src/css/less`)) {
		// Copy in less
		shell.cp('-r', `${options.temp}/.latestSkeletal/src/css/less/_custom.less`,`${options.dest}/src/css/less/`)
		shell.cp('-r', `${options.temp}/.latestSkeletal/src/css/less/_neto.less`,`${options.dest}/src/css/less/`)
		shell.cp('-r', `${options.temp}/.latestSkeletal/src/css/less/_variables.less`,`${options.dest}/src/css/less/`)
		shell.cp('-r', `${options.temp}/.latestSkeletal/src/css/less/app.less`,`${options.dest}/src/css/less/`)
	}else if (fs.existsSync(`${options.temp}/.latestSkeletal/src/scss`)) {
		// Copy in sass
		shell.cp('-r', `${options.temp}/.latestSkeletal/src/scss/_custom.scss`,`${options.dest}/src/scss/`)
		shell.cp('-r', `${options.temp}/.latestSkeletal/src/scss/_neto.scss`,`${options.dest}/src/scss/`)
		shell.cp('-r', `${options.temp}/.latestSkeletal/src/scss/_bootstrap.scss`,`${options.dest}/src/scss/`)
		shell.cp('-r', `${options.temp}/.latestSkeletal/src/scss/app.scss`,`${options.dest}/src/scss/`)
	}
	// Copy in css
	shell.cp('-r', `${options.temp}/.latestSkeletal/src/css/app.css`,`${options.dest}/src/css/`)
	shell.cp('-r', `${options.temp}/.latestSkeletal/src/css/skeletal-style.css`,`${options.dest}/src/css/${options.dest}-style.css`)
	// Copy some other required files
	shell.cp('-r', `${options.temp}/.latestSkeletal/.gitignore`,`${options.dest}/`)
	shell.cp('-r', `${options.temp}/.latestSkeletal/gulpfile.js`,`${options.dest}/`)
	shell.cp('-r', `${options.temp}/.latestSkeletal/package-lock.json`,`${options.dest}/`)
	shell.cp('-r', `${options.temp}/.latestSkeletal/package.json`,`${options.dest}/`)
	shell.cp('-r', `${options.temp}/.latestSkeletal/README.md`,`${options.dest}/`)
	// Copy buildkite
	shell.cp('-r', `${options.temp}/.latestSkeletal/.buildkite/.`,`${options.dest}/.buildkite/`)
	log(success("👍 Copying done!"))
	// Remove temp folder
	shell.rm('-rf', options.temp)
	callback()
}
function installModules(options, callback){
	log(warning("Installing all of the theme dependecies."))
	// Setup NPM
	shell.cd(`${options.dest}`)
	shell.exec('npm install')
	log(success("👍👍👍 Modules installed!"))
	callback()
}
