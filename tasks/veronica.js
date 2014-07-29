/*
 * grunt-veronica
 * https://github.com/gochant/grunt-veronica
 *
 * Copyright (c) 2014 channing
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('veronica', 'build veronica project', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            reqConfig: '',
            modules: [],
            optimize: "none", // uglify
            solution: '',
            notMerge: [],
            merge: [],
            clean: [],
            buildPaths: {},
            cssPack: "", // all, module, none
            cssTarget: './test/target/app/styles'
        });

        var _ = require('underscore');
        var path = require('path');
        var reqConf = options.reqConfig;

        var appBasePath = path.join(reqConf.appDir, reqConf.baseUrl);

        var helper = {
            // ����ģ���������е�Դ����
            getSourcesFromModules: function (modules, reqConf) {
                var sources = [];
                var createSource = function (module, type) {
                    return {
                        origin: path.join(reqConf.appDir, reqConf.baseUrl, module.source, module.name, type),
                        target: path.join(reqConf.dir, reqConf.baseUrl, type + '/temp', module.name),
                        copy: path.join(reqConf.dir, reqConf.baseUrl, type),
                        type: type
                    };
                }
                _.each(modules, function (module) {
                    sources.push(createSource(module, 'widgets'));
                    sources.push(createSource(module, 'plugins'));
                });

                return sources;
            },
            // ��ȡ�����ĳ����·������ʵ·��
            getRelativePath: function (originBasePath, originPath, currBasePath) {
                // ʵ��·��
                var truePath = path.join(originBasePath, originPath);
                var dep = 10;  // �趨������ϲ���10��
                // �����·������Ӧ�ó���·���У��򸽼�Ӧ�ó���·��
                if (path.join(currBasePath, originPath).indexOf(path.join(reqConf.appDir)) < 0) {
                    originPath = path.join(appBasePath, originPath);
                }

                while (truePath !== path.join(currBasePath, originPath) && dep !== 0) {
                    originPath = path.join('../', originPath);
                    dep--;
                }
                return originPath;
            },
            // ��ȡĳ������ԴĿ¼�µ����в�������Ϊÿ���������� RequireJS ��ģ������
            // ������������Դ·����
            getReqModulesAndPathsFromSources: function (sources) {
                var widgetsRefPath = {};
                var modules = _.map(sources, function (source) { // source: { origin, target }
                    var fs = require('fs');
                    var origin = source.origin;

                    if (!source || !fs.existsSync(source.origin)) {
                        return false;
                    }

                    var subSource = [];  // ���ǲ����ļ���

                    // �ҵ������ļ�������
                    var dirs = fs.readdirSync(origin);

                    _.each(dirs, function (dir) {
                        if (_.indexOf(fs.readdirSync(origin + '/' + dir), 'main.js') < 0) {
                            subSource.push(dir);
                        }
                    });

                    var result = _.map(_.reject(dirs, function (dir) {
                        // �ų�������ļ����У����ƺ�����Դ·������
                        return _.find(['.css', '.js', '.DS_Store', 'styles'].concat(subSource), function (tag) {
                            return dir.indexOf(tag) > -1;
                        });
                    }), function (dir) {

                        widgetsRefPath[dir] = 'empty:';
                        _.each(['main', 'styles', 'views', 'templates'], function (name) {
                            var m = dir + '/' + name;
                            widgetsRefPath[m] = m;
                        });

                        return {
                            name: dir + '/main',
                            // name: getRelativePath('./', source.origin, basePath) + '/' + dir + '/main',
                            exclude: ['text', 'css']
                        };
                    });

                    return result;
                });
                return {
                    modules: modules,
                    paths: widgetsRefPath
                }
            },
            // ��ȡ����Դ��Req����
            getSourcesReqConfig: function (sources, modulesConfig, options) {
                var widgetModules = modulesConfig.modules;
                var widgetRefPaths = modulesConfig.paths;
                var reqConf = options.reqConfig;

                return _.map(sources, function (source, index) {

                    var widgetPaths = {};
                    var widgetPackages = [];
                    var modules = widgetModules[index];

                    // �������¼����ļ�����ڲ����ļ��е���ȷ·�� ['text', 'css', 'normalize', 'css-builder']
                    // reqConf.paths

                    _.each(reqConf.paths, function (path, pathName) {
                        if (!_.contains(['text', 'css', 'normalize', 'css-builder'], pathName)) return;
                        widgetPaths[pathName] = _.contains(options.notMerge, pathName) ?
                            'empty:' : helper.getRelativePath(appBasePath, path, source.origin);
                    });
                    _.each(reqConf.packages, function (pkg) {
                        var clonePkg = _.clone(pkg);
                        clonePkg.location = _.contains(options.notMerge, pkg.name)
                            ? 'empty:' : helper.getRelativePath(appBasePath, clonePkg.location, source.origin);
                        widgetPackages.push(clonePkg);
                    });

                    return {
                        baseUrl: source.origin,
                        dir: source.target,
                        paths: _.extend({}, widgetRefPaths, widgetPaths, options.buildPaths || {}),
                        modules: modules,
                        packages: widgetPackages
                    };
                });

            }
        };

        var sources = helper.getSourcesFromModules(options.modules, reqConf);
        var reqModuleConfigsAndPaths = helper.getReqModulesAndPathsFromSources(sources);
        var sourcesReqConfig = helper.getSourcesReqConfig(sources, reqModuleConfigsAndPaths, options);
        var solutionPath = helper.getRelativePath('./', options.solution, appBasePath);
        var moduleInclude = _.map(options.modules, function (mod) {
            return mod.source + '/' + mod.name + '/main';
        });

        var defaultSiteOptions = {
            appDir: reqConf.appDir,
            baseUrl: reqConf.baseUrl,
            dir: reqConf.dir,
            modules: [{
                name: 'main', include: [solutionPath]
                  .concat(options.merge)
                  .concat(moduleInclude)
            }],
            paths: reqConf.paths || {},
            shim: reqConf.shim || {},
            packages: reqConf.packages || [],
            optimize: options.optimize,
            onBuildRead: function (moduleName, path, contents) {
                if (moduleName.indexOf('require-conf') > -1) {
                    return contents.replace(/debug\s*\:\s*(true|false)/g, 'debug: false, optimized: true');
                }
                if (moduleName === 'main') {
                    return 'window.verSolution="' + solutionPath + '";\n' + contents;
                }
                return contents;
            },
            preserveLicenseComments: false,
            removeCombined: true,
            fileExclusionRegExp: /^\./
        };

        var defaultWidgetOptions = {
            shim: reqConf.shim || {},
            optimize: options.optimize,
            // optimizeCss: "none",
            removeCombined: true,
            preserveLicenseComments: false,
            fileExclusionRegExp: /^\./,
            separateCSS: true,
            onBuildWrite: function (moduleName, path, contents) {
                // Bugfixed������δ֪������£��п��ܻ����ʶ���˲��������
                var packageName = moduleName.substring(0, moduleName.indexOf('/main'));
                if (packageName.length > 0) {
                    return contents + "\ndefine('" + packageName + "', ['" + moduleName + "'], function (main) { return main; });";
                }
                return contents;
            }
        };

        grunt.initConfig({
            // ��������
            requirejs: {
                // ������վ
                site: {
                    options: defaultSiteOptions
                },
                widget: {
                    options: defaultWidgetOptions
                }
            },
            concat: {
                options: {
                    separator: '\n'
                }
            },
            copy: { main: {} },
            clean: {
                // TODO: ����д����һЩ·�����迼��һ�ָ����ŵķ�ʽ
                main: [
                   reqConf.dir + '/**/*.less',
                   reqConf.dir + '/**/build.txt'
                ],
                output: [reqConf.dir],
                others: options.clean,
                widgets: [reqConf.dir + '/widgets/temp', reqConf.dir + '/plugins/temp']
            },
            css_combo: {
                main: {
                    files: {
                        'public/styles/index.css': ['public/styles/index.css']
                    }
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-css-combo');

        grunt.registerTask('site', ['requirejs:site']);

        grunt.registerTask('widgets', function () {
            var widgetStyles = [];

            // �ֱ�Ϊÿ������Դ���д��
            _.each(sources, function (source, i) {

                if (!sourcesReqConfig[i].modules) return;

                var options = _.extend({}, grunt.config('requirejs.widget.options'), sourcesReqConfig[i]);

                var thisStyles = grunt.file.expand([source.origin + '/**/*.css', '!' + source.origin + '/**/*.min.css']);
                //var thisStyles = grunt.file.expand(['./test/**/*.css', '!' + './test/**/*.min.css']);
                widgetStyles = widgetStyles.push(thisStyles);

                grunt.config('requirejs.widget' + i, { options: options });

                // ����Դ�µ�����css�ϲ���һ��css��ϲ�css�ļ���·���ǣ�Դ·�� + /styles/all.css
                grunt.config('concat.widget' + i, {
                    src: [source.origin + '/**/*.css', '!' + source.origin + '/**/*.min.css'],
                    dest: source.target + '/styles/all.css'
                });

                grunt.config('clean.widget' + i, {
                    src: [
                        source.target + '/**/templates/',
                        source.target + '/*/**/styles/',
                        source.target + '/**/build.txt',
                        source.target + '/**/css.js',
                        source.target + '/**/css-builder.js',
                        source.target + '/**/normalize.js',
                        source.target + '/**/text.js'
                    ]
                });

                grunt.config('copy.widget' + i, {
                    expand: true,
                    cwd: source.target + '/',
                    src: '**',
                    dest: source.copy
                    // flatten: true,
                    // filter: 'isFile'
                })

                // ѹ����Ŀ¼�����в��
                grunt.task.run('requirejs:widget' + i);
                // �ϲ���Ŀ¼������CSS�ļ��������IE��31����ʽ���������⣩
                grunt.task.run('concat:widget' + i);
                // ����
                grunt.task.run('clean:widget' + i);
                // ��������
                grunt.task.run('copy:widget' + i);

            });

            var allStyleStream = '';
            _.each(widgetStyles, function (styles, idx) {
                if (options.cssPack === "module") {
                    var stream = '';
                    _.each(styles, function (style) {
                        stream += '@import "' + style + '";\n';
                    });
                    grunt.file.write(options.cssTarget + '/module' + idx + '.css', stream);
                } else {
                    _.each(styles, function (style) {
                        allStyleStream += '@import "' + style + '";\n';
                    });
                }
            });
            grunt.file.write(options.cssTarget + '/modules.css', allStyleStream);

            grunt.task.run('clean:widgets');
        });

        grunt.registerTask('default', function () {
            grunt.task.run('clean:output');
            grunt.task.run('site');
            grunt.task.run('widgets');
            //// grunt.task.run('pages');
            //grunt.task.run('css_combo');
            grunt.task.run('clean:main');
            grunt.task.run('clean:others');


        });

        grunt.registerTask('publish', function () {
            grunt.task.run('default');
            grunt.task.run('clean:source');
        });

        grunt.task.run('default');
    });

};
