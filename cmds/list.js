/* list commander component
 * To use add require('../cmds/list.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

const homedir = require('os').homedir();
const path = require('path');
const chalk = require('chalk');

const util = require('../lib/util.js');

module.exports = function(program) {

	program
		.command('list')
		.version('0.0.1')
		.description('Lists all available templates.')
		.action(function (/* Args here */) {
			// Your code goes here
			let templateDir = path.join(homedir, "shiny/templates/");
			let templates = util.loadTemplates(templateDir);
			templates.forEach(template => {
				console.log(chalk.green(template.name + " (" + chalk.underline(template.command) + "): ") + template.description);
			})
		});

};
