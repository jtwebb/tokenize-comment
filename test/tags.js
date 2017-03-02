'use strict';

require('mocha');
var assert = require('assert');
var support = require('./support');
var tokenize = require('..');

var fixtures = support.files(__dirname, 'fixtures');

describe('tags', function() {
  it('should tokenize a comment with a tag', function() {
    var tok = tokenize('/* foo\nbar\nbaz\n * \n@param {string} something */');
    assert.deepEqual(tok, {
      description: 'foo\nbar\nbaz',
      examples: [],
      tags: [
        {
          type: 'tag',
          raw: '@param {string} something',
          key: 'param',
          val: '{string} something'
        }
      ]
    });
  });

  it('should tokenize a comment with multiple tags', function() {
    var tok = tokenize(`
      /**
       * foo bar baz
       *
       * @param {string} something
       * @param {string} else
       */
    `);

    assert.deepEqual(tok, {
      description: 'foo bar baz',
      examples: [],
      tags: [
        {
          key: 'param',
          raw: '@param {string} something',
          type: 'tag',
          val: '{string} something'
        },
        {
          key: 'param',
          raw: '@param {string} else',
          type: 'tag',
          val: '{string} else'
        }
      ]
    });
  });

  it.skip('should work with malformed tags', function() {
    var tok = tokenize(fixtures['tags-malformed']);

    assert.deepEqual(tok, {
      description: '',
      examples: [],
      tags:
       [ '@private',
         '@param {*} obj',
         '@return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,\n                   String ...)' ]
    });
  });

  it('should work with trailing malformed tags', function() {
    var tok = tokenize(fixtures['tags-malformed-trailing']);
    assert.deepEqual(tok, {
      description: '',
      examples: [],
      tags: [
        {
          type: 'tag',
          raw: '@private',
          key: 'private',
          val: ''
        },
        {
          type: 'tag',
          raw: '@param {*} obj',
          key: 'param',
          val: '{*} obj'
        },
        {
          type: 'tag',
          raw: '@return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,',
          key: 'return',
          val: '{boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,\n                   String ...)'
        }
      ]
    });
  });

  it('should tokenize a comment with no tags', function() {
    var tok = tokenize(fixtures['description-no-tags']);

    assert.deepEqual(tok, {
      description: 'documentMode is an IE-only property\nhttp://msdn.microsoft.com/en-us/library/ie/cc196988(v=vs.85).aspx',
      examples: [],
      tags: []
    });
  });

  it('should tokenize a comment that starts with a @description tag', function() {
    var tok = tokenize(fixtures['description-tag'].replace(/\/\/[^\n]+/, ''));

    assert.deepEqual(tok, {
      description: 'This object provides a utility for producing rich Error messages within\n Angular. It can be called as follows:\n\n var exampleMinErr = minErr(\'example\');\n throw exampleMinErr(\'one\', \'This {0} is {1}\', foo, bar);\n\n The above creates an instance of minErr in the example namespace. The\n resulting error will have a namespaced error code of example.one.  The\n resulting error will replace {0} with the value of foo, and {1} with the\n value of bar. The object is not restricted in the number of arguments it can\n take.\n\n If fewer arguments are specified than necessary for interpolation, the extra\n interpolation markers will be preserved in the final string.\n\n Since data will be parsed statically during a build step, some restrictions\n are applied with respect to how minErr instances are created and called.\n Instances should have names of the form namespaceMinErr for a minErr created\n using minErr(\'namespace\') . Error codes, namespaces and template strings\n should all be static strings, not variables or general expressions.',
      examples: [],
      tags: [
        {
          type: 'tag',
          raw: '@param {string} module The namespace to use for the new minErr instance.',
          key: 'param',
          val: '{string} module The namespace to use for the new minErr instance.'
        },
        {
          type: 'tag',
          raw: '@param {function} ErrorConstructor Custom error constructor to be instantiated when returning',
          key: 'param',
          val: '{function} ErrorConstructor Custom error constructor to be instantiated when returning\n   error from returned function, for cases when a particular type of error is useful.'
        },
        {
          type: 'tag',
          raw: '@returns {function(code:string, template:string, ...templateArgs): Error} minErr instance',
          key: 'returns',
          val: '{function(code:string, template:string, ...templateArgs): Error} minErr instance'
        }
      ]
    });
  });

  it('should tokenize a comment with a @description tag in the middle', function() {
    var tok1 = tokenize(fixtures['description-tag-middle'].replace(/\/\/[^\n]+/, ''));

    assert.deepEqual(tok1, {
      description: '# ng (core module)\n The ng module is loaded by default when an AngularJS application is started. The module itself\n contains the essential components for an AngularJS application to function. The table below\n lists a high level breakdown of each of the services/factories, filters, directives and testing\n components available within this core module.\n\n <div doc-module-components="ng"></div>',
      examples: [],
      tags: [
        {
          key: 'ngdoc',
          raw: '@ngdoc module',
          type: 'tag',
          val: 'module'
        },
        {
          key: 'name',
          raw: '@name ng',
          type: 'tag',
          val: 'ng'
        },
        {
          key: 'module',
          raw: '@module ng',
          type: 'tag',
          val: 'ng'
        }
      ]
    });

    var tok2 = tokenize(fixtures['description-tag-middle2'].replace(/\/\/[^\n]+/, ''));

    assert.deepEqual(tok2, {
      description: 'Converts the specified string to lowercase.',
      examples: [],
      tags: [
        {
          key: 'ngdoc',
          raw: '@ngdoc function',
          type: 'tag',
          val: 'function'
        },
        {
          key: 'name',
          raw: '@name angular.lowercase',
          type: 'tag',
          val: 'angular.lowercase'
        },
        {
          key: 'module',
          raw: '@module ng',
          type: 'tag',
          val: 'ng'
        },
        {
          key: 'kind',
          raw: '@kind function',
          type: 'tag',
          val: 'function'
        },
        {
          key: 'param',
          raw: '@param {string} string String to be converted to lowercase.',
          type: 'tag',
          val: '{string} string String to be converted to lowercase.'
        },
        {
          key: 'returns',
          raw: '@returns {string} Lowercased string.',
          type: 'tag',
          val: '{string} Lowercased string.'
        }
      ]
    });
  });
});
