#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const chalk = require('chalk')
const log = console.log
const success = chalk.green
const warning = chalk.yellow

module.exports.compile = (opt) => {
	var options = {}
	// Folder where everything will be compiled to
	options.master = opt.master
	options.uncompressed = opt.uncompressed
	options.branch = opt.branch
	options.dist = './dist'
	options.masterTheme = `${options.dist}/.masterTheme`

	options.src = 'src'
	options.TEMPLATES = `${options.src}/templates`
	options.CSS = `${options.src}/css`
	options.LESS = `${options.CSS}/less`
	options.SCSS = `${options.src}/scss`
	options.JS = `${options.src}/js`
	options.IMG = `${options.src}/img`
	if (fs.existsSync('./package.json')) {
		options.pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
	}

	log(success("Theme Starter Kit 👜"))
	log(success("This script will compile a Neto theme so it is ready for the theme store"))
	log(warning("Compiling theme"))

	// Recreate the 'dist' directory
	shell.rm('-rf', options.dist)
	shell.mkdir('-p', options.dist)
	shell.cd('./')

	if(typeof options.master == "undefined"){
		if(options.pkg.generated_theme && options.pkg.generated_theme.branch !== 'master'){
			log(warning(`Fetching version ${options.pkg.generated_theme.branch} of Skeletal.`))
			shell.exec(`git clone -b "${options.pkg.generated_theme.branch}" --depth 1 https://github.com/NetoECommerce/Skeletal.git ${options.masterTheme}`)
		}else if(options.branch !== undefined){
			log(warning(`Fetching version ${options.branch} of Skeletal.`))
			shell.exec(`git clone -b "${options.branch}" --depth 1 https://github.com/NetoECommerce/Skeletal.git ${options.masterTheme}`)
		}else{
			log(warning("Fetching latest version of Skeletal."))
			shell.exec(`git clone --depth 1 https://github.com/NetoECommerce/Skeletal.git ${options.masterTheme}`)
		}
	}

	options.themes = getThemeNames(options)

	zipThemes(options, function(){
		if(typeof options.master == "undefined"){
			shell.rm('-rf', `${options.masterTheme}`)
		}
		if(typeof options.uncompressed == "undefined"){
			log(warning("Compressing themes..."))
			shell.cd(`${options.dist}/`)
			fs.readdirSync('./').forEach(themeFolder => {
				// Zip each folder
				shell.exec(`zip -rq ${themeFolder}.zip ${themeFolder}`)
				shell.rm('-rf', themeFolder);
			})
			shell.cd("../")
		}
		log(success("👍👍👍 Swag!"))
	})
}
// Place the theme names into an array
function getThemeNames(options){
	var themes = []
	if(options.pkg.theme_names){
		log(warning('Using package.json theme_names to create theme(s)'))
		themes = options.pkg.theme_names
	}else{
		log(warning('Using neto-theme-info file to create theme(s)'))
		var files = fs.readdirSync(`./${options.TEMPLATES}`)
		files.forEach(file => {
			if(file.indexOf("-netothemeinfo.txt") !== -1){
				var theme = file.replace(/-netothemeinfo.txt*$/, "")
				themes.push(theme)
			}
		})
	}
	return themes;
}
// Create a zip file for each theme
function zipThemes(options, callback){
	options.themes.forEach(theme => {
		log(warning(`Building '${theme}' theme...`))
		var themeFolder = `${options.dist}/${theme}`
		if(typeof options.uncompressed == "undefined"){
			var themeTemplatesFolder = `${themeFolder}`
			var themeAssetsFolder = `${themeFolder}/_assets`
		}else{
			var themeTemplatesFolder = `${themeFolder}/templates`
			var themeAssetsFolder = `${themeFolder}`
		}
		// Create theme folder
		shell.mkdir('-p', themeFolder)
		shell.mkdir('-p', themeAssetsFolder)
		if(typeof options.master == "undefined"){
			// Copy latest from Skeletal
			shell.cp('-r', `${options.masterTheme}/${options.TEMPLATES}/.`, themeTemplatesFolder)
			shell.cp('-r', `${options.masterTheme}/${options.CSS}`, themeAssetsFolder)
			if (fs.existsSync(`${options.masterTheme}/${options.SCSS}`)) {
				shell.cp('-r', `${options.masterTheme}/${options.SCSS}`, themeAssetsFolder)
			}
			shell.cp('-r', `${options.masterTheme}/${options.JS}`, themeAssetsFolder)
		}
		// Copy templates
		shell.cp('-r', `./${options.TEMPLATES}/.`, themeTemplatesFolder)
		// Copy assets
		if (fs.existsSync(`./${options.CSS}`)) {
			shell.cp('-r', `./${options.CSS}`, themeAssetsFolder)
		}
		if (fs.existsSync(`./${options.SCSS}`)) {
			shell.cp('-r', `./${options.SCSS}`, themeAssetsFolder)
		}
		if (fs.existsSync(`./${options.JS}`)) {
			shell.cp('-r', `./${options.JS}`, themeAssetsFolder)
		}
		if (fs.existsSync(`./${options.IMG}`)) {
			shell.cp('-r', `./${options.IMG}`, themeAssetsFolder)
		}
		if (fs.existsSync('./gulpfile.js')) {
			shell.cp('-r', `./gulpfile.js`, themeAssetsFolder)
		}
		if (fs.existsSync('./package.json')) {
			shell.cp('-r', `./package.json`, themeAssetsFolder)
		}
		// Rename info file to netothemeinfo.txt
		shell.mv(`${themeTemplatesFolder}/${theme}-netothemeinfo.txt`, `${themeTemplatesFolder}/netothemeinfo.txt`)
		// Rename stylesheet to style.css
		shell.mv(`${themeAssetsFolder}/css/${theme}-style.css`, `${themeAssetsFolder}/css/style.css`)
		log(success(`👍 ${theme} built!`))
	})
	callback()
}
