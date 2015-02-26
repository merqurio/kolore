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
        less: {
            development: {
                files: {
                    'static/css/kube.css': 'static/plugins/kube/less/kube.less' // destination file and source file
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['static/plugins/hutsa/main.js',
                    'static/js/*.js'
                ],
                dest: 'static/dist/production.js'
            },
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'static/dist/production.js',
                dest: 'static/dist/production.min.js'
            },
        },
        cssmin: {
            target: {
                files: {
                    'static/dist/production.min.css': ['static/plugins/normalize.css/normalize.css',
                        'static/plugins/hutsa/menu.css',
                        'static/css/*.css'
                    ]
                }
            }
        },
        watch: {
            files: ['static/css/*.css', 'static/js/*.js','static/plugins/kube/less/kube.less'],
            tasks: ['less', 'concat', 'uglify', 'cssmin']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['less', 'concat', 'uglify', 'cssmin']);

};
