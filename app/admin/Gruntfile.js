module.exports = function (grunt) {

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
                }, { // Open Sans
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/open-sans-fontface/fonts/',
                    src: '**/**',
                    dest: 'static/fonts'
                }, { // Select2
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/select2/',
                    src: ['select2.min.js'],
                    dest: 'static/dist/select2/'
                }, { // Redactor
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/redactor/',
                    src: ['css/redactor.css', 'css/redactor-font.eot'],
                    dest: 'static/dist/redactor/'
                }, { // Photoswipe
                    expand: true,
                    dot: true,
                    cwd: 'static/plugins/photoswipe/dist',
                    src: ['photoswipe.css', 'default-skin/*'],
                    dest: 'static/dist/photoswipe/'
                }, { // jquery
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
            photoswipe:{
                src: [
                    'static/plugins/photoswipe/dist/photoswipe.js',
                    'static/plugins/photoswipe/dist/photoswipe-ui-default.js'
                ],
                dest: 'static/dist/photoswipe/production.js'
            },
            momentjs: {
                src: [
                    'static/plugins/momentjs/moment.js',
                    'static/plugins/momentjs/locale/es.js',
                    'static/plugins/momentjs/locale/eu.js'],

                dest: 'static/dist/momentjs/production.js'
            },
            redactorjs: {
                src: [
                    'static/plugins/redactor/redactor.js',
                    'static/plugins/redactor/langs/es.js',
                    'static/plugins/redactor/langs/eu.js',
                    'static/plugins/redactor/plugins/video/video.js',
                    'static/plugins/redactor/plugins/fullscreen/fullscreen.js',
                    'static/plugins/redactor/plugins/imagemanager/imagemanager.js'
                ],

                dest: 'static/dist/redactor/production.js'
            },
            js: {
                src: ['static/plugins/hutsa/main.js',
                    'static/js/*.js'
                    ],
                dest: 'static/dist/production.js'
            },
            css: {
                src: ['static/plugins/font-awesome/css/font-awesome.css',
                        'static/css/*.css',
                        'static/plugins/hutsa/menu.css'
                    ],
                dest: 'static/dist/production.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            photoswipe: {
                src: 'static/dist/photoswipe/production.js',
                dest: 'static/dist/photoswipe/production.min.js'
            },
            momentjs: {
                src: 'static/dist/momentjs/production.js',
                dest: 'static/dist/momentjs/production.min.js'
            },
            redactorjs: {
                src: 'static/dist/redactor/production.js',
                dest: 'static/dist/redactor/production.min.js'
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
                    'static/css/open-sans.css': 'static/css/open-sans.less'// destination file and source file
                }
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
