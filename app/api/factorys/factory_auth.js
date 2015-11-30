/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .factory('Auth', ['$http', '$cookies', '$q',
            function($http, $cookies, $q){
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
                        $http.post('/signin', user).success(function(res){
                            changeUser(res);
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
                    checkEmail: function(email){
                        var deferred = $q.defer();
                        var message = {
                            isExist: false,
                            message: ''
                        };
                        $http.post('/checkemail', {email: email}).success(function(res){
                            switch(res.status.code){
                                case 200:
                                    message.isExist = false;
                                    message.message = res.status.message;
                                    break;
                                case 422:
                                    message.isExist = true;
                                    message.message = res.status.message;
                                    break;
                            }
                            deferred.resolve(message);
                        }).error(function(){
                            message.isExist = true;
                            message.message = 'server error';
                            deferred.resolve(message);
                        })
                        return deferred.promise;
                    },
                    checkName: function(loginname){
                        var deferred = $q.defer();
                        var message = {
                            isExist: false,
                            message: ''
                        };
                        $http.post('/checkloginname', {loginname: loginname}).success(function(res){
                            switch(res.status.code){
                                case 200:
                                    message.isExist = false;
                                    message.message = res.status.message;
                                    break;
                                case 422:
                                    message.isExist = true;
                                    message.message = res.status.message;
                                    break;
                            }
                            deferred.resolve(message);
                        }).error(function(){
                            message.isExist = true;
                            message.message = 'server error';
                            deferred.resolve(message);
                        })
                        return deferred.promise;
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