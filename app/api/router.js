/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
            function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
                var access = config_router.accessLevels;

                // Public routes
                $stateProvider
                    .state('public', {
                        abstract: true,
                        template: "<ui-view/>",
                        data: {
                            access: access.public
                        }
                    })
                    .state('public.404', {
                        url: '/404/',
                        templateUrl: '404'
                    })
                    .state('main', {
                        url: '/main/',
                        templateUrl: '../views/tpl/main.html',
                        data: {
                            access: access.public
                        }
                    })
                    .state('circle', {
                        url: '/circle/',
                        templateUrl: '../views/tpl/tpl_circle.html',
                        data: {
                            access: access.public
                        }
                    })
                    .state('register_accountinfo', {
                        url: '/register_accountinfo/',
                        templateUrl: '../views/tpl/tpl_register_accountinfo.html',
                        data: {
                            access: access.public
                        }
                    })
                    .state('register_userinfo', {
                        url: '/register_userinfo/',
                        templateUrl: '../views/tpl/tpl_register_userinfo.html',
                        data: {
                            access: access.public
                        }
                    });

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
                        if(!('data' in toState) || !('access' in toState.data)){
                            $rootScope.error = "Access undefined for this state";
                            event.preventDefault();
                        }else if (!Auth.authorize(toState.data.access)){
                            $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
                            event.preventDefault();

                            if(fromState.url === '^') {
                                if(Auth.isLoggedIn()) {
                                    $state.go('user.home');
                                } else {
                                    $rootScope.error = null;
                                    $state.go('anon.login');
                                }
                            }
                        }
                    }
                )
            }
        ])
})()