#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const zipFolder = require('./zipFolder')
const chalk = require('chalk')
const log = console.log
const success = chalk.green
const warning = chalk.yellow
const error = chalk.red

module.exports.compileTheme = () => {
	// Folder where everything will be compiled to
	const DIST = "./dist"
	// Recreate the 'dist' directory
	shell.rm('-rf', DIST)
	shell.mkdir('-p', DIST)
	shell.cd('./')
	log(warning("Fetching latest Skeletal..."))
	shell.exec(`git clone --depth 1 https://github.com/NetoECommerce/Skeletal.git ${DIST}/.latestSkeletal`)

	const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
	if(pkg.theme_names){
		log(warning('Using package.json theme_names to create theme(s)'))
		var THEMES = pkg.theme_names
	}else{
		log(warning('Using neto-theme-info file to create theme(s)'))
		shell.cd("./src/templates")
		var THEMES = shell.ls('-A', '*-netothemeinfo.txt')
		shell.cd("../../")
	}

	THEMES.forEach(theme => {
		theme = theme.replace(/-netothemeinfo.txt*$/, "")
		log(warning(`Building '${theme}' theme...`))
		// Create theme folder
		shell.mkdir('-p', `${DIST}/${theme}`)
		shell.mkdir('-p', `${DIST}/${theme}/_assets`)
		// Copy latest from Skeletal
		shell.cp('-r', `${DIST}/.latestSkeletal/src/templates/.`, `${DIST}/${theme}/`)
		shell.cp('-r', `${DIST}/.latestSkeletal/src/css`, `${DIST}/${theme}/_assets`)
		shell.cp('-r', `${DIST}/.latestSkeletal/src/js`, `${DIST}/${theme}/_assets`)
		// Copy templates
		shell.cp('-r', `./src/templates/.`, `${DIST}/${theme}/`)
		// Copy assets
		if (fs.existsSync('./src/css')) {
			shell.cp('-r', `./src/css`, `${DIST}/${theme}/_assets`)
		}
		if (fs.existsSync('./src/js')) {
			shell.cp('-r', `./src/js`, `${DIST}/${theme}/_assets`)
		}
		if (fs.existsSync('./src/img')) {
			shell.cp('-r', `./src/img`, `${DIST}/${theme}/_assets`)
		}
		if (fs.existsSync('./gulpfile.js')) {
			shell.cp('-r', `./gulpfile.js`, `${DIST}/${theme}/_assets`)
		}
		if (fs.existsSync('./package.json')) {
			shell.cp('-r', `./package.json`, `${DIST}/${theme}/_assets`)
		}
		// Rename stylesheet to style.css
		shell.mv(`${DIST}/${theme}/_assets/css/${theme}-style.css`, `${DIST}/${theme}/_assets/css/style.css`)
		// Rename info file to netothemeinfo.txt
		shell.mv(`${DIST}/${theme}/${theme}-netothemeinfo.txt`, `${DIST}/${theme}/netothemeinfo.txt`)
		log(success(`👍 ${theme} built!`))
	})

	shell.cd("./dist/")
	shell.rm('-rf', "./.latestSkeletal")
	log(warning("Compressing themes..."))

	fs.readdirSync('./').forEach(themeFolder => {
		// Zip each folder
		zipFolder(themeFolder, () => { log(success(`Compressed ${themeFolder}`))})
		shell.rm('-rf', themeFolder)
	})

	shell.cd("../")
	log(success("👍👍👍 Swag!"))
	shell.exit(1)
}
