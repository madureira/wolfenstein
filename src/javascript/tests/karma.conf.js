module.exports = function(config) {
    config.set({
        basePath: '../../..',
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        files: [
            "build/doom.vendors.min.js",
            "build/doom.templates.js",
            "build/doom.js",
            "src/javascript/tests/**/*.test.js"
        ],
        colors: true
    });
};
