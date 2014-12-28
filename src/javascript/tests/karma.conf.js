module.exports = function(config) {
    config.set({
        basePath: '../../..',
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],

        port: 9876,

        files: [
            { pattern: 'src/resources/**/*.png', watched: false, included: false, served: true },
            'build/wolfenstein.vendors.min.js',
            'build/wolfenstein.templates.min.js',
            'build/wolfenstein.js',
            'src/javascript/tests/**/*.test.js'
        ],

        proxies: {
            '/src/resources/': '/base/src/resources/'
        },

        colors: true,

        reporters: ['progress', 'coverage'],

        preprocessors: {
            'src/javascript/tests/**/!(*.test).js': 'coverage'
        },

        coverageReporter: {
            type : 'lcov',
            dir : 'src/javascript/tests/coverage/'
        },

        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-phantomjs-launcher',
        ],

        singleRun: false
    });
};
