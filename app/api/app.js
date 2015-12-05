/**
 * Created by zan on 10/18/15.
 */
var app = angular.module("app", ['ui.router','ngAnimate','ngAria',
                                'ngMessages','ngCookies','ngSanitize',
                                'ngFoobar', 'angularModalService']);

app.run(['$templateCache', function ($templateCache) {
    $templateCache.put('header.html','./views/tpl/header.html');
    $templateCache.put('footer.html','./views/tpl/footer.html');
}]);