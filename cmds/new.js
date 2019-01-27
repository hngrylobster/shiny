/* new commander component
 * To use add require('../cmds/new.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

const homedir = require('os').homedir();
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const fg = require('fast-glob');
const mustache = require('mustache');
const sanitize = require("sanitize-filename");
const handlebars = require("handlebars");

const util = require('../lib/util.js');
const filters = require('../lib/filters.js');

module.exports = function(program) {

	program
		.command('new <what> [params...]')
		.version('0.0.1')
		.description('Something old, something new.')
		.action(function (what) {

			if (what) {

				// initialize filters
				filters.registerFilters();
				
				// try to folder in the user's home path with that name
				let templateDir = path.join(homedir, "shiny/templates/" + what);
				let currentDir = process.cwd();

				// if it finds the folder, find a config inside it and load the missing variables as prompts
				if (fs.pathExistsSync(templateDir)) {

					let configPath = path.join(templateDir, "shiny.json");

					if (fs.pathExistsSync(configPath)) {

						// load the configuration file
						let config = {};
						try {
							config = require(configPath);
						} catch (error) {
							console.error("Oops. There was an error reading that template's configuration.");
							process.exit();
						}

						// load the passed in parameters
						let passedInValues = process.argv.slice(4);
						let shinyParameters = [];
						let questions = [];
						let preAnswers = {};

						passedInValues.forEach(function(value) {
							let option = {};
							option.name = value.split("=")[0];
							option.value = value.split("=")[1];
							shinyParameters.push(option);
						});

						config.variables.forEach(function(variable) {

							// for every possible variable, check if a user has already passed in an answer/value
							let found = false;
							shinyParameters.forEach(function(param) {
								if (variable.name == param.name) {
									// we have an answer, lets' add it to the answers array
									preAnswers[variable.name] = param.value;
									found = true;
								}
							});

							// if we didn't find it, add it to the list of questions to ask the user
							if (!found) {
								questions.push({
									type: variable.type,
									name: variable.name,
									message: variable.message
								})
							}
						});

						// prompt for all the variables in the questions array
						inquirer.prompt(questions).then(answers => {

							// merge the answers with the parameters to form a final name=value array
							let finalAnswers = Object.assign({}, answers, preAnswers);

							// for each file in the directory, run through the rules engine to see if this file is OK to copy
							let files = fg.sync([templateDir + '/**', '!**/shiny.json'], { dot: true } );

							files.forEach(function(file){
								let relativeFile = path.relative(templateDir, file);

								// mustache option
								//let destFileName = mustache.render(path.join(currentDir, relativeFile), finalAnswers);

								// handlebars option
								let originalFileName = path.join(currentDir, relativeFile);
								let destFileName = '';

								// if this isn't a dot file, run the filename through Handlebars
								if (originalFileName.startsWith(".")) {
									destFileName = originalFileName;
								} else {
									let template = handlebars.compile(originalFileName);
									destFileName = template(finalAnswers);
								}

								try {
									if (util.shouldWriteFile(relativeFile, config.rules, finalAnswers)) {
										console.log(chalk.green("Writing: " + destFileName));
										util.writeFile(destFileName, file, finalAnswers);
									}
								} catch (error) {
									console.error("Oops. shiny ran into a problem writing a file or two. Please try again.");
								}
								
							});

							// now we can exit
							process.exit();
						});

					} else {
						console.error("Oops. This template is misconfigured and needs a shiny.json file.");
					}

				} else {
					console.error("Oops. shiny doesn't see a template for that one yet.");
					// do we prompt to create and navigate to that folder?
				}
				
			} else {
				// if no parameter is passed, throw an error
				console.error("Oops. shiny doesn't know what to create. Please pass in an object name.");
			}

		});

};
