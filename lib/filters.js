const handlebars = require("handlebars");

/**
 * Basic Standard Filters for strings:
 *
 *     {{size "Plus"}}
 * 
 * Would give you 4!
 *
 * @author: Paul Legan
 */
var strings = {
    size: function (input) {
      return input ? input.length : 0;
    },
  
    downcase: function (input) {
      return typeof input === 'string' ? input.toLowerCase() : input;
    },
  
    upcase: function (input) {
      return typeof input === 'string' ? input.toUpperCase() : input;
    },
  
    capitalize: function (input) {
      return typeof input === 'string' ? input.charAt(0).toUpperCase() + input.slice(1) : input;
    },
  
    escape: function (input) {
      return escape(input);
    },
  
    slug: function (input) {
      if (!input || typeof input !== 'string') return input;
      return input.replace(/^\s+|\s+$/g, '').toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    }
}

module.exports = {
    registerFilters: function() {
        for (var i in strings) {
          handlebars.registerHelper(i, strings[i]);
        }
    }
}
