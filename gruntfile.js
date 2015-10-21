/**
 * Created by zan on 10/18/15.
 */
'use strict';

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        less: {
            build: {
                expand: true,
                cwd: 'app/assets/styles/less',
                src: ['*.less'],
                dest: 'app/assets/styles/css',
                ext: '.css'
            }
        },
        watch: {
            files: ['app/assets/styles/less/**/*.less'],
            tasks: ['default']
        }
    })

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['less']);
}

