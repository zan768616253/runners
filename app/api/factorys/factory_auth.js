/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .factory('AuthFactory', ['$http', '$cookies', '$location', '$rootScope',
            function($http, $cookies, $location, $rootScope){
                return{
                    login: function (data, success, error) {
                    },
                    signin: function (data, success, error) {
                    },
                    logout: function (data, success, error) {
                    },
                    checkAuth: function (target){
                        if(!$cookies.getObject(target)) {
                            return false;
                        }
                        return true;
                    },
                    checkNotAuth: function (target) {
                        if($cookies.getObject(target)) {
                        }
                    },
                    setAuth: function(target, data) {
                        $cookies.putObject(target,data);
                    },
                    getAuth: function(target) {
                        return $cookies.getObject(target)
                    },
                    removeAuth: function(target) {
                        $cookies.remove(target);
                    }
                }
            }
        ])
        .factory('HintFactory', ['$http',
            function ($http){
                return {
                    getHintsCount: function (data, success, error) {
                    },
                    getAllHints: function (data, success, error) {
                    },
                    pullRequest: function (data, success, error) {
                    },
                    markHint: function (data, success, error) {
                    },
                    acceptHint: function (data, success, error) {
                    }
                };
            }
        ])
})()