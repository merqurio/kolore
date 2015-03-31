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
        copy: {
            dist: {
                files: [{ // Font-awesome
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/font-awesome/fonts/',
                    src: ['*.*'],
                    dest: 'static/fonts'
                },{ // Open Sans
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/open-sans-fontface/fonts/',
                    src: '**/**',
                    dest: 'static/fonts'
                },{ // Select2
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/select2/',
                    src: ['select2.min.js'],
                    dest: 'static/dist/select2/'
                },{ // Redactor
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/redactor/',
                    src: ['redactor.js','langs/es.js', 'langs/eu.js', 'css/redactor.css','css/redactor-font.eot',
                          'plugins/video/video.js', 'plugins/fullscreen/fullscreen.js', 'plugins/imagemanager/imagemanager.js'],
                    dest: 'static/dist/redactor/'
                },{ // Photoswipe
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/photoswipe/dist',
                    src: ['photoswipe.css','photoswipe.min.js', 'photoswipe-ui-default.min.js', 'default-skin/*'],
                    dest: 'static/dist/photoswipe/'
                },{ // jquery
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/jquery/dist',
                    src: '*.min*',
                    dest: 'static/dist/'
                }]
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['static/plugins/hutsa/main.js',
                    'static/plugins/momentjs/moment.js',
                    'static/plugins/momentjs/locale/es.js',
                    'static/plugins/momentjs/locale/eu.js',
                    'static/js/*.js'
                ],
                dest: 'static/dist/production.js'
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
        less: {
            development: {
                files: {
                    'static/css/kube.css': 'static/css/kube.less',
                    'static/css/open-sans.css': 'static/plugins/open-sans-fontface/open-sans.less'// destination file and source file
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'static/dist/production.min.css': [
                        'static/plugins/hutsa/menu.css',
                        'static/plugins/font-awesome/css/font-awesome.css',
                        'static/css/*.css'
                    ]
                }
            }
        },
        watch: {
            files: ['static/css/*.css', 'static/js/*.js','static/css/*.less'],
            tasks: ['less', 'concat', 'uglify', 'cssmin']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['copy', 'concat', 'uglify', 'less', 'cssmin']);
};
