#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const chalk = require('chalk')
const log = console.log
const success = chalk.green
const warning = chalk.yellow

module.exports.migrate = (branch) => {
	// Setup variables
	var options = {}
	branch ? options.branch = branch : options.branch = undefined
	options.generatedThemeName = 'Skeletal'
	options.generatedThemeOwner = 'NetoECommerce'
	if(options.branch){
		options.generatedThemeGit = `git://github.com/${options.generatedThemeOwner}/${options.generatedThemeName}.git#${options.branch}`
		options.generatedThemeBranch = options.branch
	}else{
		options.generatedThemeGit = `git://github.com/${options.generatedThemeOwner}/${options.generatedThemeName}.git`
		options.generatedThemeBranch = 'master'
	}
	if (fs.existsSync('./package.json')) {
		log(success("Theme Starter Kit 👜"))
		log(success("This script will migrate a Neto theme so it can use the other Theme Starter Kit scripts"))
		log(warning("Migrating theme"))
		options.pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))

		log(warning("Add generated_theme information"))
		options.pkg.generated_theme = { "name": options.generatedThemeName,"branch": options.generatedThemeBranch ,"git": options.generatedThemeGit}

		log(warning("Add compile script"))
		if(options.branch){
			options.pkg.scripts.compile = `node_modules/.bin/ntheme compile -b ${options.branch}`
		}else{
			options.pkg.scripts.compile = 'node_modules/.bin/ntheme compile'
		}
		if(options.pkg.devDependencies.ntheme){
			delete options.pkg.devDependencies.ntheme
		}
		if(options.pkg.devDependencies.Skeletal){
			delete options.pkg.devDependencies.Skeletal
		}
		fs.writeFileSync('./package.json', JSON.stringify(options.pkg, null, 2))
		log(warning("Add Skeletal and ntheme dependency"))
		shell.exec(`npm i --save-dev ${options.generatedThemeGit} ntheme`)
		log(success(`👍👍👍 Theme migrated!`))
	}
}
