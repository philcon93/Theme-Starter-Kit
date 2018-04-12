#!/usr/bin/env node

const shell = require('shelljs')
const chalk = require('chalk')
const log = console.log
const success = chalk.green
const warning = chalk.yellow

module.exports.generateTheme = (name) => {
	// Folder where everything will be compiled to
	if(name){
		var DEST = `./${name}`
	}else{
		var DEST = './newTheme'
		var name = 'theme'
	}
	var TEMP = './temp'

	// Remove dist and temp directories
	shell.rm('-rf', DEST)
	shell.mkdir('-p', DEST)
	shell.rm('-rf', TEMP)
	shell.mkdir('-p', TEMP)

	// Determine the theme list dynamically
	shell.cd('./')

	log(success("Theme starter kit 👜"))
	log(success("This script will setup a new theme repository for you so you can start working on a new website."))

	log(warning("Building a new theme"))
	log(warning("Cloning the latest version of Skeletal from GitHub."))
	shell.exec(`git clone --depth 1 https://github.com/NetoECommerce/Skeletal.git ${TEMP}/.latestSkeletal`)
	log(success("👍 Skeletal cloned!"))

	log(warning("Creating the required directories."))
	// Create directories for templates
	shell.mkdir('-p', `${DEST}/src`)
	shell.mkdir('-p', `${DEST}/src/templates`)
	shell.mkdir('-p', `${DEST}/src/templates/headers`)
	shell.mkdir('-p', `${DEST}/src/templates/cms`)
	shell.mkdir('-p', `${DEST}/src/templates/footers`)
	// Create directories for assets
	shell.mkdir('-p', `${DEST}/src/css`)
	shell.mkdir('-p', `${DEST}/src/css/less`)
	// Create Buildkite directory
	shell.mkdir('-p', `${DEST}/.buildkite`)
	log(success("👍 Directories created!"))

	log(warning("Copying the required files from Skeletal to our new theme."))
	// Copy in some standard templates from Skeletal
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/templates/headers/template.html`,`${DEST}/src/templates/headers/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/templates/footers/template.html`,`${DEST}/src/templates/footers/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/templates/cms/home.template.html`,`${DEST}/src/templates/cms/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/templates/skeletal-netothemeinfo.txt`,`${DEST}/src/templates/${name}-netothemeinfo.txt`)
	// Copy in less
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/css/less/_custom.less`,`${DEST}/src/css/less/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/css/less/_neto.less`,`${DEST}/src/css/less/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/css/less/_variables.less`,`${DEST}/src/css/less/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/css/less/app.less`,`${DEST}/src/css/less/`)
	// Copy in css
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/css/app.css`,`${DEST}/src/css/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/src/css/skeletal-style.css`,`${DEST}/src/css/${DEST}-style.css`)
	// Copy some other required files
	shell.cp('-r', `${TEMP}/.latestSkeletal/.gitignore`,`${DEST}/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/gulpfile.js`,`${DEST}/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/package-lock.json`,`${DEST}/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/package.json`,`${DEST}/`)
	shell.cp('-r', `${TEMP}/.latestSkeletal/README.md`,`${DEST}/`)
	// Copy buildkite
	shell.cp('-r', `${TEMP}/.latestSkeletal/.buildkite/.`,`${DEST}/.buildkite/`)

	// Remove temp folder
	shell.rm('-rf', TEMP)
	log(success("👍 Copying done!"))

	log(warning("Installing all of the NPM dependecies."))
	// Setup NPM
	shell.cd(`${DEST}`)
	shell.exec('npm install')

	log(success("👍👍👍 Modules installed!"))
	log(success(`Your new theme is located at ${DEST}. You can go there in terminal with the command cd ${DEST}`))
	log(success("Congratulations! You can now start working on your new theme."))
	shell.exit(1)
}
