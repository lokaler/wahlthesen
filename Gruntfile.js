module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bg-shell');

	grunt.registerTask('default', 'dev');
	grunt.registerTask('dev', [
		'connect:dev',
		'bgShell:compasswatch',
		'watch:livereloadstyles'
	]);

	grunt.initConfig({

		connect: {
			dev: {
				options: {
					port: 7000,
					hostname: 'localhost'
				}
			}
		},

		watch: {
			options: {
				livereload: true
			},
			livereloadstyles: {
				files: ['app/styles/style.css']
			}
		},

		bgShell: {
			guard: {
				cmd: 'guard.bat start -i',
				stdout: true,
				bg: false
			},
			compasswatch: {
				cmd: 'compass watch app/sass',
				stdout: true,
				bg: true
			},
			compasscompile: {
				cmd: 'compass compile app/sass',
				stdout: true,
				bg: false
			}
		}

	});

}
