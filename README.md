#shiny

## Description

`shiny` lets you create simple Handlebars.js-based templates for common or repetitive tasks. Think of this as a simplified `yeoman` that you can more easily edit yourself via your templates folder.

## Usage

To install shiny from npm, run:

```
$ npm install -g shiny
```

```shiny --help```

Your templates are located in `~/shiny/templates`. Each template has a `shiny.json` file that has configuration information. It lets you define:

1. Rules: Set of conditions for specific files to be copied from the template.
2. Variables: Set of all variables that can be used in the Handlebars.js templates.

Here is an example:

```json
{
    "variables": [
        { "name": "component", "message": "Please enter your component name.", "type": "input" },
        { "name": "dialog", "message": "Include a dialog?", "type": "confirm" }
    ],
    "rules": [
        {
            "file": "{{component}}/dialog.xml",
            "condition": {
                "variable": "dialog",
                "operation": "equals",
                "value": true
            }
        }
    ]
}
```

To use a template, run the following command:

```
shiny new [object]
```

This will utilize a template stored at `~/shiny/templates/object` and pull in the related files and subfolders. You will be prompted to enter each of the variable values present in the `shiny.json` configuration file. However, you can pass some or all of these variables in as name=value pairs to the command, like so:

```
shiny new [object] component="Hello World"
```

There is no limit to how many files can exist within a template, and both file/folder names and the contents of a file can include placeholders for variable swap. Here is an example where both a file and folder have variables within their names:

```
.
├── shiny.json
└── {{component}}
    ├── dialog.xml
    ├── readme.md
    └── {{component}}.html
```

## Template Library

Many templates are available in a separate repository:
https://github.com/hngrylobster/shiny-templates

You can clone this repository into your `~/shiny/templates` directory to get them all.

```
git clone https://github.com/hngrylobster/shiny-templates.git ~/shiny/templates
```

## License

Copyright (c) 2019 Paul Legan

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
