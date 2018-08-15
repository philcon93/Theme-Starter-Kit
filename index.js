#!/usr/bin/env node

const program = require('commander');
const pkg = require('./package.json');
const { generate } = require('./scripts/generate');
const { compile } = require('./scripts/compile.js');
const { migrate } = require('./scripts/migrate.js');

program
	.version(pkg.version)

program
	.command('generate <themeName>')
	.alias('g')
	.option('-b, --branch <branchName>', 'Branch name or release tag')
	.description('Generates a Neto theme based on a Skeletal branch')
	.action(function (themeName, options){
		generate(themeName, options.branch)
	});

program
	.command('compile')
	.alias('c')
	.option('-b, --branch <branchName>', 'Branch name or release tag')
	.option('-m, --master', 'Compiles a master theme')
	.option('-u, --uncompressed', 'Compiles a theme as if it was installed from theme store')
	.description('Compiles a Neto theme for the theme store')
	.action(function (options){
		compile(options)
	});

	program
		.command('migrate')
		.alias('m')
		.option('-b, --branch <branchName>', 'Branch name or release tag')
		.description('Migrates a Neto theme so it can use the other Theme Starter Kit scripts based on a Skeletal branch')
		.action(function (options){
			migrate(options.branch)
		});

program.parse(process.argv);

if (program.args.length === 0) program.help();
