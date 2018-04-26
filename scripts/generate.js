#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const chalk = require('chalk')
const log = console.log
const success = chalk.green
const warning = chalk.yellow

module.exports.generateTheme = (name, branch) => {
	// Setup variables
	var options = {}
	if(name){
		options.dest = `./${name}`
		options.name = name
	}else{
		options.dest = './newTheme'
		options.name = 'theme'
	}
	options.tempFolder = './temp'
	options.tempSkeletal = `${options.tempFolder}/.latestSkeletal`
	options.src = 'src'
	options.TEMPLATES = `${options.src}/templates`
	options.CSS = `${options.src}/css`
	options.LESS = `${options.CSS}/less`
	options.SCSS = `${options.src}/scss`
	branch ? options.branch = branch : options.branch = undefined
	// Remove dist and temp directories
	shell.rm('-rf', options.dest)
	shell.mkdir('-p', options.dest)
	shell.rm('-rf', options.tempFolder)
	shell.mkdir('-p', options.tempFolder)
	shell.cd('./')

	log(success("Theme starter kit 👜"))
	log(success("This script will setup a new theme repository for you so you can start working on a new website."))
	log(warning("Building a new theme"))
	// Get master theme
	if(options.branch){
		log(warning(`Cloning version ${options.branch} of Skeletal.`))
		shell.exec(`git clone -b "${options.branch}" --depth 1 https://github.com/NetoECommerce/Skeletal.git ${options.tempSkeletal}`)
	}else{
		log(warning("No branch/tag defined, cloning latest version of Skeletal."))
		shell.exec(`git clone --depth 1 https://github.com/NetoECommerce/Skeletal.git ${options.tempSkeletal}`)
	}
	log(success("👍 Skeletal cloned!"))

	makeDir(options, function(){
		copyFiles(options, function(){
			installModules(options, function(){
				log(success(`Your new theme is located at ${options.dest}. You can go there in terminal with the command cd ${options.dest}`))
				log(success("Congratulations! You can now start working on your new theme."))
			})
		})
	})
}
// Make required directories
function makeDir(options, callback){
	log(warning("Creating the required directories."))
	// Create directories for templates
	shell.mkdir('-p', `${options.dest}/${options.src}`)
	shell.mkdir('-p', `${options.dest}/${options.TEMPLATES}`)
	shell.mkdir('-p', `${options.dest}/${options.TEMPLATES}/headers`)
	shell.mkdir('-p', `${options.dest}/${options.TEMPLATES}/cms`)
	shell.mkdir('-p', `${options.dest}/${options.TEMPLATES}/footers`)
	// Create directories for assets
	shell.mkdir('-p', `${options.dest}/${options.CSS}`)
	if (fs.existsSync(`${options.tempSkeletal}/${options.LESS}`)) {
		shell.mkdir('-p', `${options.dest}/${options.LESS}`)
	}else if (fs.existsSync(`${options.tempSkeletal}/${options.SCSS}`)) {
		shell.mkdir('-p', `${options.dest}/${options.SCSS}`)
	}
	log(success("👍 Directories created!"))
	callback()
}
// Copy over required files from Skeletal
function copyFiles(options, callback){
	log(warning("Copying the required files from Skeletal to our new theme."))
	// Copy in required templates from Skeletal
	shell.cp('-r', `${options.tempSkeletal}/${options.TEMPLATES}/headers/template.html`,`${options.dest}/${options.TEMPLATES}/headers/`)
	shell.cp('-r', `${options.tempSkeletal}/${options.TEMPLATES}/footers/template.html`,`${options.dest}/${options.TEMPLATES}/footers/`)
	shell.cp('-r', `${options.tempSkeletal}/${options.TEMPLATES}/cms/home.template.html`,`${options.dest}/${options.TEMPLATES}/cms/`)
	shell.cp('-r', `${options.tempSkeletal}/${options.TEMPLATES}/skeletal-netothemeinfo.txt`,`${options.dest}/${options.TEMPLATES}/${options.name}-netothemeinfo.txt`)
	if (fs.existsSync(`${options.tempSkeletal}/${options.LESS}`)) {
		// Copy in less
		shell.cp('-r', `${options.tempSkeletal}/${options.LESS}/_custom.less`,`${options.dest}/${options.LESS}/`)
		shell.cp('-r', `${options.tempSkeletal}/${options.LESS}/_neto.less`,`${options.dest}/${options.LESS}/`)
		shell.cp('-r', `${options.tempSkeletal}/${options.LESS}/_variables.less`,`${options.dest}/${options.LESS}/`)
		shell.cp('-r', `${options.tempSkeletal}/${options.LESS}/app.less`,`${options.dest}/${options.LESS}/`)
	}else if (fs.existsSync(`${options.tempSkeletal}/${options.SCSS}`)) {
		// Copy in sass
		shell.cp('-r', `${options.tempSkeletal}/${options.SCSS}/_custom.scss`,`${options.dest}/${options.SCSS}/`)
		shell.cp('-r', `${options.tempSkeletal}/${options.SCSS}/_neto.scss`,`${options.dest}/${options.SCSS}/`)
		shell.cp('-r', `${options.tempSkeletal}/${options.SCSS}/_bootstrap.scss`,`${options.dest}/${options.SCSS}/`)
		shell.cp('-r', `${options.tempSkeletal}/${options.SCSS}/app.scss`,`${options.dest}/${options.SCSS}/`)
	}
	// Copy in css
	shell.cp('-r', `${options.tempSkeletal}/${options.CSS}/app.css`,`${options.dest}/${options.CSS}/`)
	shell.cp('-r', `${options.tempSkeletal}/${options.CSS}/skeletal-style.css`,`${options.dest}/${options.CSS}/${options.dest}-style.css`)
	// Copy other required files
	shell.cp('-r', `${options.tempSkeletal}/.gitignore`,`${options.dest}/`)
	shell.cp('-r', `${options.tempSkeletal}/gulpfile.js`,`${options.dest}/`)
	shell.cp('-r', `${options.tempSkeletal}/package-lock.json`,`${options.dest}/`)
	shell.cp('-r', `${options.tempSkeletal}/package.json`,`${options.dest}/`)
	shell.cp('-r', `${options.tempSkeletal}/README.md`,`${options.dest}/`)
	log(success("👍 Copying done!"))
	// Remove temp folder
	shell.rm('-rf', options.tempFolder)
	callback()
}
// Install npm modules
function installModules(options, callback){
	// Add Skeletal as a dependency
	if (fs.existsSync(`${options.dest}/package.json`)) {
		options.pkg = JSON.parse(fs.readFileSync(`${options.dest}/package.json`, 'utf8'))
		options.generatedThemeName = 'Skeletal'
		options.generatedThemeOwner = 'NetoECommerce'
		options.generatedThemeGit = `git://github.com/${options.generatedThemeOwner}/${options.generatedThemeName}.git`
		if(options.branch){
			options.pkg.devDependencies.Skeletal = `${options.generatedThemeGit}#${options.branch}`
			options.pkg.generated_theme = { "name": `${options.generatedThemeName}`,"branch": options.branch,"git": `${options.generatedThemeGit}#${options.branch}`}
		}else{
			options.pkg.devDependencies.Skeletal = `${options.generatedThemeGit}`
			options.pkg.generated_theme = { "name": `${options.generatedThemeName}`,"branch": 'master',"git": `${options.generatedThemeGit}`}
		}
		fs.writeFileSync(`${options.dest}/package.json`, JSON.stringify(options.pkg, null, 2))
	}
	log(warning("Installing all of the theme dependecies."))
	shell.cd(`${options.dest}`)
	shell.exec('npm install')
	log(success("👍👍👍 Modules installed!"))
	callback()
}
