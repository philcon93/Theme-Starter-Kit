#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const chalk = require('chalk')
const log = console.log
const success = chalk.green
const warning = chalk.yellow

module.exports.compileTheme = (branch) => {
	var options = {}
	options.pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
	// Folder where everything will be compiled to
	options.dist = "./dist"
	if(branch !== undefined){
		options.branch = branch
	}else{
		options.branch = undefined
	}
	options.temp = '.latestSkeletal'
	// Recreate the 'dist' directory
	shell.rm('-rf', options.dist)
	shell.mkdir('-p', options.dist)
	shell.cd('./')
	if(options.branch !== undefined){
		log(warning(`Fetching version ${options.branch} of Skeletal.`))
		shell.exec(`git clone -b "${options.branch}" --depth 1 https://github.com/NetoECommerce/Skeletal.git ${options.dist}/${options.temp}`)
	}else{
		log(warning("No branch/tag defined, Fetching latest version of Skeletal."))
		shell.exec(`git clone --depth 1 https://github.com/NetoECommerce/Skeletal.git ${options.dist}/${options.temp}`)
	}

	if(options.pkg.theme_names){
		log(warning('Using package.json theme_names to create theme(s)'))
		options.themes = options.pkg.theme_names
	}else{
		log(warning('Using neto-theme-info file to create theme(s)'))
		shell.cd("./src/templates")
		options.themes = shell.ls('-A', '*-netothemeinfo.txt')
		shell.cd("../../")
	}

	zipThemes(options, function(){
		shell.cd("./dist/")
		shell.rm('-rf', `./${options.temp}`)
		log(warning("Compressing themes..."))

		fs.readdirSync('./').forEach(themeFolder => {
			// Zip each folder
			shell.exec(`zip -rq ${themeFolder}.zip ${themeFolder}`)
			shell.rm('-rf', themeFolder);
		})

		shell.cd("../")
		log(success("👍👍👍 Swag!"))
		shell.exit(1)
	})
}

function zipThemes(options, callback){
	options.themes.forEach(theme => {
		theme = theme.replace(/-netothemeinfo.txt*$/, "")
		log(warning(`Building '${theme}' theme...`))
		// Create theme folder
		shell.mkdir('-p', `${options.dist}/${theme}`)
		shell.mkdir('-p', `${options.dist}/${theme}/_assets`)
		// Copy latest from Skeletal
		shell.cp('-r', `${options.dist}/${options.temp}/src/templates/.`, `${options.dist}/${theme}/`)
		shell.cp('-r', `${options.dist}/${options.temp}/src/css`, `${options.dist}/${theme}/_assets`)
		if (fs.existsSync(`${options.dist}/${options.temp}/src/scss`)) {
			shell.cp('-r', `${options.dist}/${options.temp}/src/scss`, `${options.dist}/${theme}/_assets`)
		}
		shell.cp('-r', `${options.dist}/${options.temp}/src/js`, `${options.dist}/${theme}/_assets`)
		// Copy templates
		shell.cp('-r', `./src/templates/.`, `${options.dist}/${theme}/`)
		// Copy assets
		if (fs.existsSync('./src/css')) {
			shell.cp('-r', `./src/css`, `${options.dist}/${theme}/_assets`)
		}
		if (fs.existsSync('./src/scss')) {
			shell.cp('-r', `./src/scss`, `${options.dist}/${theme}/_assets`)
		}
		if (fs.existsSync('./src/js')) {
			shell.cp('-r', `./src/js`, `${options.dist}/${theme}/_assets`)
		}
		if (fs.existsSync('./src/img')) {
			shell.cp('-r', `./src/img`, `${options.dist}/${theme}/_assets`)
		}
		if (fs.existsSync('./gulpfile.js')) {
			shell.cp('-r', `./gulpfile.js`, `${options.dist}/${theme}/_assets`)
		}
		if (fs.existsSync('./package.json')) {
			shell.cp('-r', `./package.json`, `${options.dist}/${theme}/_assets`)
		}
		// Rename stylesheet to style.css
		shell.mv(`${options.dist}/${theme}/_assets/css/${theme}-style.css`, `${options.dist}/${theme}/_assets/css/style.css`)
		// Rename info file to netothemeinfo.txt
		shell.mv(`${options.dist}/${theme}/${theme}-netothemeinfo.txt`, `${options.dist}/${theme}/netothemeinfo.txt`)
		log(success(`👍 ${theme} built!`))
		callback()
	})
}
