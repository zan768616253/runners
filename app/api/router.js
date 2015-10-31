/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
            function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
                var access = config_router.accessLevels;

                $stateProvider
                    .state('main', {
                        url: '/main',
                        templateUrl: './views/tpl/main.html',
                        data: {
                            //access: access.public
                        }
                    })
                    .state('circle', {
                        url: '/circle',
                        templateUrl: './views/tpl/tpl_circle.html',
                        data: {
                            //access: access.public
                        }
                    })
                    .state('register', {
                        url: '/register',
                        templateUrl: './views/tpl/tpl_register.html',
                        data: {
                            access: access.public
                        }
                    })

                $urlRouterProvider.otherwise('/');

                $httpProvider.interceptors.push(function($q, $location){
                    return{
                        'responseError': function(response){
                            if(response.status === 401 || response.status === 403) {
                            }
                            return $q.reject(response);
                        }
                    }
                });
            }
        ])
        .run(['$rootScope', '$state', 'Auth',
            function ($rootScope, $state, Auth){
                $rootScope.$on("$stateChangeStart",
                    function(event, toState, toParams, fromState, fromParams){

                    }
                )
            }
        ])
})()