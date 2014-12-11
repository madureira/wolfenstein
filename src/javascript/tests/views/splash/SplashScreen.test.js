/**
 * Specs to @link{ App.views.splash.SplashScreen }
 *
 * @author rmadureira
 *
 */
describe('SplashScreen', function() {

    // Dependencies
    var $selector = App.Properties.selectorEngine;
    var tmpl = App.Properties.templateEngine;

    it('should set the height and with on splash screen', function() {
        var spy = spyOn($selector.fn, 'css').andReturn($selector.fn);

        var splashView = new App.views.splash.SplashScreen();
        splashView.init();

        expect($selector('.splash-screen').css).toHaveBeenCalled();
    });

    it('should get the template defined to splash screen', function() {
        var spy = spyOn(tmpl, 'splash.splash_screen');

        var splashView = new App.views.splash.SplashScreen();
        splashView.init();

        expect(tmpl['splash.splash_screen']).toHaveBeenCalled();
    });

    it('should append the splash screen template into container', function() {
        var spy = spyOn($selector.fn, 'append');

        var splashView = new App.views.splash.SplashScreen();
        splashView.init();

        var expectedTemplate = tmpl['splash.splash_screen']();

        expect($selector(App.container).append).toHaveBeenCalledWith(expectedTemplate);
    });

    it('should invoke component manager to remove splash screen after timeout', function() {
        var managerSpy = spyOn(window.App.views.components, 'Manager');

        var splashView = new App.views.splash.SplashScreen();
        splashView.init();

        setTimeout(function() {
            expect(managerSpy.init).toHaveBeenCalledWith('.splash-screen');
        }, 3000);
    });

});
