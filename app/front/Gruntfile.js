module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            js: {
                src: [
                    'static/js/*.js'
                    ],
                dest: 'static/dist/production.js'
            },
            css: {
                src: [
                    'static/css/*.css'
                ],
                dest: 'static/dist/production.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'static/dist/production.js',
                dest: 'static/dist/production.min.js'
            }
        },
        cssmin: {
            target: {
                files: {
                    'static/dist/production.min.css': [
                        'static/dist/production.css'
                    ]
                }
            }
        },
        watch: {
            files: ['static/css/*.css', 'static/js/*.js', 'static/css/*.less'],
            tasks: ['concat', 'uglify', 'cssmin']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
};
