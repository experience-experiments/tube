'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Configurable paths
	var config = {
		app: 'app',
		dist: 'dist'
	};

	grunt.initConfig({

		// Project settings
		config: config,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['bowerInstall']
			},
			js: {
				files: ['<%= config.app %>/scripts/{,*/}*.js'],
				tasks: ['jshint'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			compass: {
				files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
				tasks: ['compass:server']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			styles: {
				files: ['<%= config.app %>/styles/{,*/}*.css'],
				tasks: [],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= config.app %>/*.html',
					'<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// Grunt server and debug server setting
		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				// change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			livereload: {
				options: {
					open: true,
					base: [
						'<%= config.app %>'
					]
				}
			},
			test: {
				options: {
					open: false,
					base: [
						'test',
						'<%= config.app %>'
					]
				}
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [
					{
						dot: true,
						src: [
							'<%= config.dist %>/*',
							'!<%= config.dist %>/.git*'
						]
					}
				]
			},
			server: '.tmp'
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= config.app %>/scripts/{,*/}*.js',
				'!<%= config.app %>/scripts/vendor/*',
				'test/spec/{,*/}*.js'
			]
		},

		mocha: {
			all: {
				options: {
					run: true,
					urls: ['http://localhost:<%= connect.options.port %>/index.html']
				}
			}
		},

		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: '<%= config.app %>/styles',
				cssDir: '<%= config.dist %>/styles',
				generatedImagesDir: '<%= config.dist %>/images/generated',
				imagesDir: '<%= config.app %>/images',
				javascriptsDir: '<%= config.app %>/scripts',
				fontsDir: '<%= config.app %>/styles/fonts',
				importPath: '<%= config.app %>/bower_components',
				httpImagesPath: '/images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '/styles/fonts',
				relativeAssets: false,
				assetCacheBuster: false
			},
			dist: {
			},
			test: {
			},
			server: {
				options: {
					cssDir: '<%= config.app %>/styles',
					debugInfo: true
				}
			}
		},

		// Automatically inject Bower components into the HTML file
		bowerInstall: {
			app: {
				src: [
					'<%= config.app %>/*.html'
				]
			},
			sass: {
				src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
				ignorePath: '<%= config.app %>/bower_components/'
			}
		},

		requirejs: {
			dist: {
				// Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
				options: {
					baseUrl: 'app/scripts',
					paths: {
						"requireLib": "../bower_components/requirejs/require"
					},
					mainConfigFile: 'app/scripts/config.js',
					name: "main",
					include: ['requireLib'],
					insertRequire: ['app'],
					out: '<%= config.dist %>/scripts/all.js',
					optimize: 'none',
					preserveLicenseComments: false,
					useStrict: true,
					wrap: true,
					keepBuildDir: true
				}
			}
		},

		useminPrepare: {
			options: {
				dest: '<%= config.dist %>'
			},
			html: [
				'<%= config.app %>/index.html'
			]
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
			},
			html: ['<%= config.dist %>/index.html'],
			css: ['<%= config.dist %>/styles/{,*/}*.css']
		},

		// The following *-min tasks produce minifies files in the dist folder
		imagemin: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.app %>/images',
						src: '{,*/}*.{gif,jpeg,jpg,png}',
						dest: '<%= config.dist %>/images'
					}
				]
			}
		},

		svgmin: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.app %>/images',
						src: '{,*/}*.svg',
						dest: '<%= config.dist %>/images'
					}
				]
			}
		},

		htmlmin: {
			dist: {
				options: {
					// removeCommentsFromCDATA: true,
					// collapseWhitespace: true,
					// collapseBooleanAttributes: true,
					// removeAttributeQuotes: true,
					// removeRedundantAttributes: true,
					// useShortDoctype: true,
					// removeEmptyAttributes: true,
					// removeOptionalTags: true
				},
				files: [
					{
						expand: true,
						cwd: '<%= config.dist %>',
						src: 'index.html',
						dest: '<%= config.dist %>'
					}
				]
			}
		},

		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
		// cssmin: {
		//   dist: {
		//     files: {
		//       '<%= config.dist %>/styles/main.css': [
		//         '<%= config.app %>/styles/{,*/}*.css'
		//       ]
		//     }
		//   }
		// },
		uglify: {
			dist: {
				files: {
					'<%= config.dist %>/scripts/all.js': [
						'<%= config.dist %>/scripts/all.js'
					]
				}
			}
		},
		// concat: {
		//   dist: {}
		// },

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= config.app %>',
						dest: '<%= config.dist %>',
						src: [
							'*.{ico,png,txt}',
							'images/{,*/}*.{webp,gif}',
							'{,*/}*.html',
							'styles/{,*/}*.css',
							'styles/fonts/{,*/}*.*'
						]
					}
				]
			},
			styles: {
				expand: true,
				dot: true,
				cwd: '<%= config.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		manifest: {
			generate: {
				options: {
					basePath: '.',
					cache: ['scripts/all.js', 'styles/main.css'],
					network: ['http://*', 'https://*'],
					preferOnline: true,
					verbose: true,
					timestamp: true,
					hash: true,
					master: ['dist/index.html']
				},
				src:[
					'scripts/*',
					'styles/*'
				],
				dest: '<%= config.dist %>/tube.appcache'
			}
		},

		// Run some tasks in parallel to speed up build process
		concurrent: {
			server: [
				'compass:server',
				'copy:styles'
			],
			dist: [
				'compass:dist',
				'imagemin',
				'svgmin'
			],
			test: [
				'compass:test'
			]
		}

	});

	grunt.registerTask('serve', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'connect:livereload',
			'watch'
		]);
	});


	grunt.registerTask('test', [
		'connect:test',
		'mocha'
	]);


	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'concurrent:dist',
		'concat',
		'cssmin',
		'uglify',
		'copy:dist',
		'usemin',
		'htmlmin',
		'requirejs:dist',
		//'uglify:dist',
		'manifest:generate'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build'
	]);
};
