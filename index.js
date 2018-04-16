#!/usr/bin/env node

const program = require('commander');
const pkg = require('./package.json');
const { generateTheme } = require('./scripts/generate');
const { compileTheme } = require('./scripts/compile.js');

program
	.version(pkg.version)

program
	.command('generate <themeName>')
	.option('-b, --branch <branchName>', 'Branch name or release tag')
	.description('Create a new Neto theme')
	.action(function (themeName, options){
		generateTheme(themeName, options.branch)
	});

program
	.command('compile')
	.description('Compiles a Neto theme')
	.action(function (){
		compileTheme()
	});

program.parse(process.argv);

if (program.args.length === 0) program.help();
