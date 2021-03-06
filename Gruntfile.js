/*
 * grunt-veronica
 * https://github.com/gochant/grunt-veronica
 *
 * Copyright (c) 2014 channing
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    var solutionPath = './test/origin/solution.js';
    var reqConf = require('./test/origin/app/req-config.js')();
    var build = require(solutionPath);

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
              'Gruntfile.js',
              'tasks/*.js',
              '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        veronica: {
            //default_options: {
            //  options: {
            //  },
            //  files: {
            //    'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
            //  }
            //},
            custom_options: {
                options: {
                    reqConfig: reqConf,
                    modules: build.modules,
                    solution: solutionPath,
                    cssTarget: './test/target/app/styles'
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    //  grunt.registerTask('test', ['clean', 'veronica', 'nodeunit']);

    // By default, lint and run all tests.
    // grunt.registerTask('default', ['jshint', 'test']);
    grunt.registerTask('default', ['veronica']);

};
