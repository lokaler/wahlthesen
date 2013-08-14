var proxy_snippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function(grunt) {

	// for compassplus
	var _ = require('lodash');
	_.str = require('underscore.string');
	String.prototype.format = function() {
		var args = Array.prototype.slice.call(arguments);
		return _.str.sprintf.apply(null, [this].concat(args));
	};

	// rewrites destination argument for copy task
	// eg.
	// OLD: app/modules/bookmarks/images/bookmarks/1.png
	//   -> dist/debug/images/app/modules/bookmarks/images/bookmarks/1.png
	// NEW: app/modules/bookmarks/images/bookmarks/1.png
	//   -> dist/debug/images/bookmarks/1.png
	function rename_dest(dest, src) {
		var re = /app\/modules\/.+\/images\/?(.*)/,
		match = re.exec(src), new_dest = dest;
		if (match[1])
			new_dest = dest + match[1];
		return new_dest;
	}

	grunt.loadNpmTasks("grunt-cssjoin");
	grunt.loadNpmTasks("grunt-targethtml");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-connect-proxy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-jst");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-bg-shell');

	grunt.registerTask("default", ["release"]);

	grunt.registerTask('dev', [
		// 'getProxiesDefinition',
		// 'configureProxies',
		'connect:dev',
		'bgShell:compasswatch',
		'watch:livereloadstyles'
	]);

	grunt.registerTask("debug", [
		// * assets and tmp styles
		"clean:debug",
		"copy:debug",
		// * styles
		"compassplus:debug",
		"cssjoin:debug",
		// scripts
		"requirejs:debug",
		"concat:debug",
		// * html
		"targethtml:debug",
		// * cleanup
		"clean:tmpstyles" // TODO: uncomment
	]);

	grunt.registerTask("release", [
		// * assets and tmp styles
		"clean:release",
		"copy:release",
		// * styles
		"compassplus:release",
		"cssjoin:release",
		"cssmin",
		// * scripts
		"requirejs:release",
		"concat:release",
		"uglify",
		// * html
		"targethtml:release",
		// * cleanup
		"clean:tmpstyles"
	]);

	// supports multiple dirs and wildcards
	grunt.registerTask('getProxiesDefinition', function() {
		var fs = require('fs'),
		  done = this.async(),
		  proxies = [],
		  filename = '%s/app/options.js'.format(__dirname);

		function fail(msg) {
			console.warn('Warning: Could not create a proxies definition: %s'.format(msg));
			done();
		}

		// parse app options files
		fs.readFile(filename, function (err, data) {

			if (err)
				fail('Could not open "%s"'.format(filename));

			var m = data.toString().match(/options\/([_a-z0-9]+)/);

			if (!m || m.length < 2)
				fail('Could not parse "%s"'.format(filename));

			// parse instance options
			var options_filename = '%s/app/options/%s.js'.format(__dirname, m[1]);
			fs.readFile(options_filename, function (err, data) {
				if (err)
					fail('Could not open "%s"'.format(options_filename));

				var m = data.toString().match(/api_base\s+=\s+['"](.+)['"]/);

				var inside_grunt = true, options;
				function define(func) {	options = func();	}
				eval(data.toString());

				var url = options.urls.api_base;

				// parse URL
				var m = url.match(/^(http.):\/\/([^/]+):?/);

				if (!m || m.length < 3)
					fail('Could not parse hostname from "%s"'.format(options_filename));

				var proto = m[1], host = m[2];

				grunt.config('connect.proxies', [{
					context: '/api',
					host: host,
					port: proto == 'http' ? 80 : 443,
					https: proto == 'https',
					changeOrigin: true
				}]);
				done();

			});

		});
	});

	// supports multiple dirs and wildcards
	grunt.registerTask('compassplus', function(mode) {
		var files = grunt.config('compass.' + mode + '.files');
		Object.keys(files).forEach(function(src) {
			var dst = files[src];
			grunt.file.expand(src).forEach(function(path) {
				grunt.registerTask(path, function() {
					grunt.config('compass.' + mode + '.options.sassDir', path);
					grunt.config('compass.' + mode + '.options.cssDir', dst);
					grunt.config('compass.' + mode + '.options.imagesDir', path + '../images/');
					
					if (_.str.startsWith(path, "app/modules/") && mode === 'dev' ) {
						var match = path.match(new RegExp(src.replace('*', '(.*)')));
						if (match) {
							var module_name = match[1];
							var http_images_path = '/app/modules/' + module_name + '/images/';
							grunt.config('compass.' + mode + '.options.httpImagesPath', http_images_path);
						}
					}

					grunt.task.run('compass:' + mode);
				});
				grunt.task.run(path);
			});
		});
	});

	grunt.initConfig({

		// The clean task ensures all files are removed from the dist/ directory so
		// that no files linger from previous builds.
		clean: {
			dev: "app/styles/compiled/**",
			tmpstyles: ["app/.tmp-styles"],
			debug:   ["dist/debug/"],
			release: ["dist/release/"]
		},

		// The jst task compiles all application templates into JavaScript
		// functions with the underscore.js template function
		jst: {
			"dist/debug/templates.js": [
				"app/templates/**/*.html"
			]
		},

		// The concatenate task is used here to merge the almond require/define
		// shim and the templates into the application code.  It's named
		// dist/debug/require.js, because we want to only load one script file in
		// index.html.
		concat: {
			debug: {
				src: [
					"lib/almond.js",
					"dist/debug/templates.js",
					"dist/debug/require.js"
				],
				dest: "dist/debug/require.js",
				separator: ";"
			},
			release: {
				src: [
					"lib/almond.js",
					"dist/release/templates.js",
					"dist/release/lokaler.js"
				],
				dest: "dist/release/lokaler.js",
				separator: ";"
			}
		},

		// watch sass files
		watch: {
			options: {
				livereload: true
			},
			livereloadstyles: {
				files: ['app/styles/**/*.css']
			},
			scripts: {
				files: ['app/**/*.js'],
				tasks: ['jshint']
			}
		},

		jshint: {
			all: ['app/**/*.js']
		},

		// compile sass
		compass: {
			dev: {
				files: {
					"app/sass": "app/styles/compiled",
					"app/modules/*/sass/": "app/styles/compiled/modules"
				},
				options: {
					debugInfo: true,
					httpImagesPath: 'overridden by compassplus:dev',
					importPath: 'app/sass'
				}
			},
			debug: {
				files: {
					"app/sass": "app/.tmp-styles/compiled",
					"app/modules/*/sass/": "app/.tmp-styles/compiled/modules"
				},
				options: {
					debugInfo: true,
					httpImagesPath: 'images',
					importPath: 'app/sass'
				}
			},
			release: {
				files: {
					"app/sass": "app/.tmp-styles/compiled",
					"app/modules/*/sass/": "app/.tmp-styles/compiled/modules"
				},
				options: {
					httpImagesPath: 'images',
					importPath: 'app/sass'
				}
			}
		},

		// index.html to dist
		targethtml: {
			debug: {
				src: "index.html",
				dest: "dist/debug/index.html"
			},
			release: {
				src: "index.html",
				dest: "dist/release/index.html"
			}
		},

		// joins @include
		cssjoin: {
			debug: {
				files: {
					"dist/debug/index.css": "app/.tmp-styles/index.css"
				}
			},
			release: {
				files: {
					"dist/release/lokaler.css": "app/.tmp-styles/index.css"
				}
			}
		},

		// Builds optimized require.js including all dependencies
		// https://github.com/gruntjs/grunt-contrib-requirejs
		requirejs: {
			debug: {
				options: {
					mainConfigFile: "app/config.js",
					out: "dist/debug/require.js",
					optimize: "none",
					name: "config"
				}
			},
			release: {
				options: {
					mainConfigFile: "app/config.js",
					out: "dist/release/lokaler.js",
					name: "config"
				}
			}
		},

		uglify: {
			release: {
				files: {
					"dist/release/lokaler.js": ["dist/release/lokaler.js"]
				}
			}
		},

		cssmin: {
			release: {
				src: "dist/release/lokaler.css",
				dest: "dist/release/lokaler.css"
			}
		},

		// copy font files
		copy: {
			debug: {
				files: [
					{
						expand: true,
						cwd: "app/styles/",
						src: "*",
						dest: "app/.tmp-styles/"
					},
					{
						expand: true,
						src: "app/modules/*/images/**",
						dest: "dist/debug/images/",
						rename: rename_dest

					},
					{
						expand: true,
						cwd: "lib/font-awesome/font/",
						src: "fontawesome-webfont.{eot,woff,ttf}",
						dest: "dist/debug/font/"
					},
					{
						expand: true,
						cwd: "lib/leaflet-0.6.2/images/",
						src: "*",
						dest: "dist/debug/images/leaflet/"
					}
				]
			},
			release: {
				files: [
					{
						expand: true,
						cwd: "app/styles/",
						src: "*",
						dest: "app/.tmp-styles/"
					},
					{
						expand: true,
						src: "app/modules/*/images/**",
						dest: "dist/release/images/",
						rename: rename_dest
					},
					{
						expand: true,
						cwd: "lib/font-awesome/font/",
						src: "fontawesome-webfont.{eot,woff,ttf}",
						dest: "dist/release/font/"
					},
					{
						expand: true,
						cwd: "lib/leaflet-0.6.2/images/",
						src: "*",
						dest: "dist/release/images/leaflet/"
					}
				]
			}
		},

		// The headless QUnit testing environment is provided for "free" by Grunt.
		// Simply point the configuration to your test directory.
		qunit: {
			all: ["test/qunit/*.html"]
		},

		// The headless Jasmine testing is provided by grunt-jasmine-task. Simply
		// point the configuration to your test directory.
		jasmine: {
			all: ["test/jasmine/*.html"]
		},

		// dev server
		connect: {
			options: {
				port: 7000,
				hostname: '0.0.0.0'
			},
			dev: {
				options: {
					middleware: function(connect, options) {
						return [
							connect.static(options.base),
							connect.directory(options.base),
							proxy_snippet
						];
					}
				}
			},
			proxies: 'overridden by getProxiesDefinition'
		},

		bgShell: {
			compasswatch: {
				cmd: 'sh compass-all.sh',
				stdout: true,
				bg: true
			},
			compasscompile: {
				cmd: 'sh compass-all.sh compile',
				stdout: true,
				bg: false
			}
		},

		jsdoc: {
			all: {
				src: [
					'README.md',
					'app/modules/*.js',
					'app/modules/*/Module.js'
				], 
				options: {
					destination: 'doc'
				}
			}
		}

	});

};
