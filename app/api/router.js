/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('main', {
                        url: '/main',
                        templateUrl: './views/tpl/main.html'
                    })
                    .state('circle', {
                        url: '/circle',
                        templateUrl: './views/tpl/circle.html'
                    })

                $urlRouterProvider.otherwise('/main');
            }
        ])
})()