/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .factory('Auth', ['$http', '$cookieStore',
            function($http, $cookieStore){

                var accessLevels = config_router.accessLevels,
                    userRoles = config_router.userRoles,
                    currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

                $cookieStore.remove('user');

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
                        $http.post('/register', user).success(function(res) {
                            changeUser(res);
                            success();
                        }).error(error);
                    },
                    login: function(user, success, error) {
                        $http.post('/login', user).success(function(user){
                            changeUser(user);
                            success(user);
                        }).error(error);
                    },
                    logout: function(success, error) {
                        $http.post('/logout').success(function(){
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
        .factory('Users', function($http) {
            return {
                getAll: function(success, error) {
                    $http.get('/users').success(success).error(error);
                }
            };
        })
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