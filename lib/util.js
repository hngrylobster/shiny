const mustache = require('mustache');
const fs = require('fs-extra');
const handlebars = require("handlebars");
const fg = require('fast-glob');
const path = require('path');

module.exports = {
    shouldWriteFile: function(file, rules, answers) {
        let pass = true;
        rules.forEach(rule => {
            if (rule.file == file) {
                // now we need to see how we test the rule (based on the condition object)
                if (rule.condition.operation == 'equals') {
                    pass = (answers[rule.condition.variable] == rule.condition.value);
                } else if (rule.condition.operation == 'does not equal') {
                    pass = (answers[rule.condition.variable] != rule.condition.value);
                } else if (rule.condition.operation == 'contains') {
                    let variable = answers[rule.condition.variable];
                    pass = variable.includes(rule.condition.value);
                }
            }
        });
        return pass;
    },
    loadTemplates: function(dir) {
        // loads all templates and descriptions
        let templates = [];
        let folders = fg.sync([dir + "**"], { onlyDirectories: true, deep: 0 });
        folders.forEach(folder => {
            let shinyConfigFile = path.join(folder, "shiny.json");
            if (fs.existsSync(shinyConfigFile)) {
                let shinyConfig = require(shinyConfigFile);
                templates.push({
                    "path": folder,
                    "command": path.basename(folder),
                    "description": shinyConfig.description,
                    "name": shinyConfig.name
                })
            }
        });
        return templates;
    },
    writeFile: function(destFile, sourceFile, data) {
        try {
            let sourceData = fs.readFileSync(sourceFile, 'utf8');

            // mustache option
            //let destData = mustache.render(sourceData, data);

            // handlebars option
            let template = handlebars.compile(sourceData);
            let destData = template(data);

            fs.outputFileSync(destFile, destData);
        } catch (err) {
            console.error(err)
        }
    },
}