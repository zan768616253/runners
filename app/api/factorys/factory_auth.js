/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .factory('Auth', ['$http', '$window', '$location', '$rootScope',
            function($http, $cookies){
                var accessLevels = config_router.accessLevels,
                    userRoles = config_router.userRoles,
                    currentUser = $cookies['user']  || { username: '', role: userRoles.public };

                function changeUser(user) {
                    angular.extend(currentUser, user);
                }

                return{
                    authorize: function(accessLevel, role){
                        if(role === undefined) {
                            role = currentUser.role;
                        }
                        return accessLevel.bitMask & role.bitMask;
                    },
                    isLoggedIn: function(user){
                        if(user === undefined) {
                            user = currentUser;
                        }
                        return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
                    },
                    register: function(user, success, error){
                        $http.post('/signup', user).success(function(res) {
                            changeUser(res);
                            success();
                        }).error(error);
                    },
                    login: function(user, success, error) {
                        $http.post('/signin', user).success(function(user){
                            changeUser(user);
                            success(user);
                        }).error(error);
                    },
                    logout: function(success, error) {
                        $http.post('/signout').success(function(){
                            changeUser({
                                username: '',
                                role: userRoles.public
                            });
                            success();
                        }).error(error);
                    },
                    accessLevels: accessLevels,
                    userRoles: userRoles,
                    user: currentUser
                }
            }
        ])
        .factory('TokenInterceptor', ['$q', '$cookies',
            function($q, $cookies){
                return{
                    request: function(config){
                        config.headers = config.headers || {};
                        if ($cookies['token']){
                            config.headers.Authorization = 'Bearer ' +  cookies['token'];
                        }
                        return config;
                    },
                    response: function (response) {

                        return response || $q.when(response);
                    }
                }
            }]
        )
        .config(['$httpProvider', function($httpProvider){

        }])
})()