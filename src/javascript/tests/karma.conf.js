module.exports = function(config) {
    config.set({
        basePath: '../../..',
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        files: [
            "build/wolfenstein.vendors.min.js",
            "build/wolfenstein.templates.min.js",
            "build/wolfenstein.js",
            "src/javascript/tests/**/*.test.js",
        ],
        colors: true
    });
};
