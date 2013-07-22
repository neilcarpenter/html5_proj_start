module.exports = (grunt) ->

    # Project configuration
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")

        # Set the path for all folders
        paths:
            source:
                coffee:   "project/develop/source"
                css:      "project/develop/stylus"
                toMerge:  "website/js/vendors/merged"
                r:        "website/js/r.js"
                js:       "website/js/main.js"
                cms:      "project/develop/cms/src"

            release:
                r:        "website/js/r.min.js"
                js:       "website/js/main.min.js"
                css:      "website/css/main.css"
                vendors:  "website/js/vendors/v.min.js"
                cms :     "website/cms/js/app.js"
                bin :     "website/"

            map:
                build     : "website/js/main.map"
                build_url : "/js/main.map"
                r         : "website/js/r.map"
                r_url     : "/js/r.map"


         # Uglify
        uglify: 
            coffee: 
              options: 
                banner           : "'use strict';\n"
                sourceMap        : "<%= paths.map.build %>"
                sourceMappingURL : "<%= paths.map.build_url %>"
                sourceMapPrefix : 2
              files: 
                '<%= paths.release.js %>': ['<%= paths.source.js %>']

            require: 
                options: 
                    banner: "'use strict';\n"
                    sourceMap     : '<%= paths.map.r %>'
                    sourceMappingURL : "<%= paths.map.r_url %>"
                    sourceMapPrefix : 2
                files: 
                    '<%= paths.release.r %>': ['<%= paths.source.r %>']


        concat: 
            options: 
                banner: '/*! <%= pkg.name %> | <%= pkg.author %> - VENDORS - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
                separator : '\n\n'
            vendors: 
              src: "<%= paths.source.toMerge %>/*.js"
              dest: '<%= paths.release.vendors %>'

       
        # Compile Stylus
        stylus: 
            compile: 
                options:
                    compress: true
                files: 
                    "<%= paths.release.css %>": "<%= paths.source.css %>/**/*.styl"
            
        # Watch for changes
        watch:
            cms: 
                files : "<%= paths.source.cms %>/**/*.coffee"
                tasks : ['percolator:cms']

            main: 
                files : ["<%= paths.source.coffee %>/**/*.coffee", "<%= paths.source.css %>/**/*.styl", "<%= paths.release.bin %>*.html"]
                tasks : ['percolator:main', 'stylus', 'uglify']
                options : 
                    livereload: true


        # Compile CoffeeScript using Percolator
        percolator: 
            cms: 
                source: '<%= paths.source.cms %>'
                output: '<%= paths.release.cms %>'
                main: 'App.coffee'

            main:
                source: '<%= paths.source.coffee %>'
                output: '<%= paths.source.js %>'
                main: 'App.coffee'

        coffee : 
            cms : 
                compile:
                    files : ['<%= paths.release.cms %>']


    # Load tasks
    grunt.loadNpmTasks "grunt-contrib-watch"
    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-stylus"
    grunt.loadNpmTasks "grunt-contrib-uglify"
    grunt.loadNpmTasks "grunt-contrib-concat"
    grunt.loadNpmTasks "grunt-coffee-percolator"


    # Register tasks.
    grunt.registerTask "default", ["percolator:main", "stylus", "uglify"]
    grunt.registerTask "w", ["percolator:main", "stylus", "uglify", "watch:main"]
    grunt.registerTask "cms", ["percolator:cms"]
    grunt.registerTask "v", ["concat:vendors"]
