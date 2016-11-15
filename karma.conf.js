//jshint strict: false
module.exports = function(config) {
    config.set({

        basePath: './app',
        frameworks: ['jasmine'],
        files: [
            'lib/jquery.min.js',
            'lib/angular.min.js',
            'lib/angular-route.min.js',
            'lib/angular-mocks.js',
            'lib/firebase.js',
            'lib/angularfire.min.js',
            'lib/angular-animate.min.js',
            'lib/angular-aria.min.js',
            'lib/angular-material.min.js',
            'lib/angular-messages.min.js',
            'js/*.js',
            'unit_tests/*.js'
        ],
        exclude: [
        ],
        preprocessors: {
            'js/site.js' : ['coverage'],
            'js/index.js' : ['coverage'],
            'js/admin.js' : ['coverage'],
            'js/team.js' : ['coverage'],
            'js/member.js' : ['coverage'],
            'js/user.js': ['coverage'],
            'js/eventteam.js': ['coverage'],
            'js/common.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            type: 'html',
            dir: 'coverage/',
            subdir: '.',
            instrumenterOptions: {
                istanbul: { noCompact: true }
            }
        },
        port: 8080,
        colors: true,
        browsers: ['Chrome'],
        singleRun: true,
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
        ]
    });
};
