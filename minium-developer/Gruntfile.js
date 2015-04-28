// Generated on 2015-02-03 using generator-jhipster 2.1.1
'use strict';
var fs = require('fs');
// Rui: I needed to remove this, it was causing problems building, and it will be no longer
// needed when we upgrade jhipster to the latest versions 
// var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

var parseString = require('xml2js').parseString;
// Returns the second occurence of the version number
var parseVersionFromPomXml = function() {
    var version;
    var pomXml = fs.readFileSync('pom.xml', "utf8");
    parseString(pomXml, function (err, result){
        // version may not be set in pom.xml project, it can be inherited from parent pom
        version = result.project.version ? result.project.version[0] : result.project.parent[0].version[0];
    });
    return version;
};

// usemin custom step
var useminAutoprefixer = {
    name: 'autoprefixer',
    createConfig: require('grunt-usemin/lib/config/cssmin').createConfig // Reuse cssmins createConfig
};

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-license-bower');

    grunt.initConfig({
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'src/main/webapp/dist'
        },
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            ngconstant: {
                files: ['Gruntfile.js', 'pom.xml'],
                tasks: ['ngconstant:dev']
            },
            styles: {
                files: ['src/main/webapp/assets/styles/**/*.css']
            },
            livereload: {
                options: {
                    livereload: 35729
                },
                files: [
                    'src/main/webapp/**/*.html',
                    'src/main/webapp/**/*.json',
                    '{.tmp/,}src/main/webapp/assets/styles/**/*.css',
                    '{.tmp/,}src/main/webapp/scripts/**/*.js',
		    '{.tmp/,}src/main/webapp/minium.developer/**/*.*',
                    'src/main/webapp/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        autoprefixer: {
        // not used since Uglify task does autoprefixer,
        //    options: ['last 1 version'],
        //    dist: {
        //        files: [{
        //            expand: true,
        //            cwd: '.tmp/styles/',
        //            src: '**/*.css',
        //            dest: '.tmp/styles/'
        //        }]
        //    }
        },
        wiredep: {
            app: {
                src: ['src/main/webapp/index.html'],
                exclude: [/angular-i18n/, /swagger-ui/,/momentjs/]
            },
            test: {
                src: 'src/test/javascript/karma.conf.js',
                exclude: [/angular-i18n/, /swagger-ui/, /angular-scenario/],
                ignorePath: /\.\.\/\.\.\//, // remove ../../ from paths of injected javascripts
                devDependencies: true,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },
        connect: {
            proxies: [
                {
                    context: '/app',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/api',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/metrics',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/dump',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/health',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/configprops',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/beans',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/api-docs',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/console',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                 }
            ],
            options: {
                port: 9000,
                // Change this to 'localhost' to deny access to the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        'src/main/webapp',
                        'src/main/webapp/minium-developer'
                    ],
                    middleware: function (connect) {
                        return [
                        	// 
                            null,
                            connect.static('.tmp'),
                            connect.static('src/main/webapp')
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        'src/main/webapp'
                    ]
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/main/webapp/scripts/app.js',
                'src/main/webapp/scripts/app/**/*.js',
                'src/main/webapp/scripts/components/**/*.js'
            ]
        },
        coffee: {
            options: {
                sourceMap: true,
                sourceRoot: ''
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/main/webapp/scripts',
                    src: ['scripts/app/**/*.coffee', 'scripts/components/**/*.coffee'],
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '**/*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        concat: {
        // not used since Uglify task does concat,
        // but still available if needed
        //    dist: {}
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/**/*.js',
                        '<%= yeoman.dist %>/assets/styles/**/*.css',
                        '<%= yeoman.dist %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/assets/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: 'src/main/webapp/**/*.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin', useminAutoprefixer] // Let cssmin concat files so it corrects relative paths to fonts and images
                        },
                            post: {}
                        }
                    }
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/assets/styles/**/*.css'],
            js: ['<%= yeoman.dist %>/scripts/**/*.js'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/assets/styles', '<%= yeoman.dist %>/assets/images', '<%= yeoman.dist %>/assets/fonts'],
                patterns: {
                    js: [
                        [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
                    ]
                },
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/main/webapp/assets/images',
                src: '**/*.{jpg,jpeg}', // we don't optimize PNG files as it doesn't work on Linux. If you are not on Linux, feel free to use '**/*.{png,jpg,jpeg}'
                    dest: '<%= yeoman.dist %>/assets/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/main/webapp/assets/images',
                    src: '**/*.svg',
                    dest: '<%= yeoman.dist %>/assets/images'
                }]
            }
        },
        cssmin: {
            // By default, your `index.html` <!-- Usemin Block --> will take care of
            // minification. This option is pre-configured if you do not wish to use
            // Usemin blocks.
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/**/*.css',
            //             'styles/**/*.css'
            //         ]
            //     }
            // }
            options: {
                root: 'src/main/webapp' // Replace relative paths for static resources with absolute path
            }
        },
        ngtemplates:    {
            dist: {
                cwd: 'src/main/webapp',
                src: ['scripts/app/**/*.html', 'scripts/components/**/*.html',],
                dest: '.tmp/templates/templates.js',
                options: {
                    module: 'miniumdevApp',
                    usemin: 'scripts/app.js',
                    htmlmin:  {
                        removeCommentsFromCDATA: true,
                        // https://github.com/yeoman/grunt-usemin/issues/44
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true,
                        conservativeCollapse: true,
                        removeAttributeQuotes: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true
                    }
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    keepClosingSlash: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'src/main/webapp',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.html',
                        'scripts/**/*.html',
                        'assets/images/**/*.{png,gif,webp}',
                        'assets/fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/assets/images',
                    dest: '<%= yeoman.dist %>/assets/images',
                    src: [
                        'generated/*'
                    ]
                }]
            },
            generateHerokuDirectory: {
                    expand: true,
                    dest: 'deploy/heroku',
                    src: [
                        'pom.xml',
                        'src/main/**'
                ]
            },
            generateOpenshiftDirectory: {
                    expand: true,
                    dest: 'deploy/openshift',
                    src: [
                        'pom.xml',
                        'src/main/**'
                ]
            }
        },
        concurrent: {
            server: [
            ],
            test: [
            ],
            dist: [
                'imagemin',
                'svgmin'
            ]
        },
        karma: {
            unit: {
                configFile: 'src/test/javascript/karma.conf.js',
                singleRun: true
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },
        buildcontrol: {
            options: {
                commit: true,
                push: false,
                connectCommits: false,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            heroku: {
                options: {
                    dir: 'deploy/heroku',
                    remote: 'heroku',
                    branch: 'master'
                }
            },
            openshift: {
                options: {
                    dir: 'deploy/openshift',
                    remote: 'openshift',
                    branch: 'master'
                }
            }
        },
        ngconstant: {
            options: {
                name: 'miniumdevApp',
                deps: false,
                wrap: '"use strict";\n// DO NOT EDIT THIS FILE, EDIT THE GRUNT TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE\n{%= __ngModule %}'
            },
            dev: {
                options: {
                    dest: 'src/main/webapp/scripts/app/app.constants.js',
                },
                constants: {
                    ENV: 'dev',
                    VERSION: parseVersionFromPomXml()
                }
            },
            prod: {
                options: {
                    dest: '.tmp/scripts/app/app.constants.js',
                },
                constants: {
                    ENV: 'prod',
                    VERSION: parseVersionFromPomXml()
                }
            }
        },
        license: {
            generate: {
                options : {
                    directory: 'src/main/webapp/bower_components',
                    output: 'target/LICENSES'
                }
            }
        }
    });

    grunt.registerTask('serve', [
        'clean:server',
        'wiredep',
        'ngconstant:dev',
        'concurrent:server',
        'configureProxies',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'wiredep:test',
        'ngconstant:dev',
        'concurrent:test',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'wiredep:app',
        'ngconstant:prod',
        'useminPrepare',
        'ngtemplates',
        'concurrent:dist',
        'concat',
        'copy:dist',
        'ngAnnotate',
        'cssmin',
        'autoprefixer',
        'uglify',
        'rev',
        // for now, let's skip this
        // 'usemin',
        //'htmlmin',
    ]);

    grunt.registerTask('buildHeroku', [
        'test',
        'build',
        'copy:generateHerokuDirectory',
    ]);

    grunt.registerTask('deployHeroku', [
        'test',
        'build',
        'copy:generateHerokuDirectory',
        'buildcontrol:heroku'
    ]);

    grunt.registerTask('buildOpenshift', [
        'test',
        'build',
        'copy:generateOpenshiftDirectory',
    ]);

    grunt.registerTask('deployOpenshift', [
        'test',
        'build',
        'copy:generateOpenshiftDirectory',
        'buildcontrol:openshift'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);
};
