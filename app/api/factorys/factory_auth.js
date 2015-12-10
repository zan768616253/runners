/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .factory('Auth', ['$http', '$cookies', '$q', 'ModalService',
            function($http, $cookies, $q, ModalService){
                var accessLevels = config_router.accessLevels,
                    userRoles = config_router.userRoles,
                    loginStatus = config.loginStatus,
                    currentUser = $cookies.getObject('User')  || { username: '', role: userRoles.public };

                function changeUser(user) {
                    angular.extend(currentUser, user);
                }

                function showSigninModal(){

                    ModalService.showModal({
                        templateUrl: "../../views/modal/modal_signin.html",
                        controller: "SignInController",
                        inputs: {
                            title: "A More Complex Example"
                        }
                    }).then(function(modal){
                        modal.element.modal();
                        modal.close;
                    });
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
                    checkAuth: function (target) {
                        if(!$cookies.getObject(target)) {
                            return false;
                        }
                        return true;
                    },
                    setAuth: function(target, data) {
                        $cookies.putObject(target,data);
                    },
                    getAuth: function(target) {
                        return $cookies.getObject(target)
                    },
                    removeAuth: function(target) {
                        $cookies.remove(target);
                    },
                    register: function(user, success, error){
                        $http.post('/signup', user).success(function(res) {
                            changeUser(res);
                            success();
                        }).error(error);
                    },
                    signin: function(user, success, error) {
                        $http.post('/signin', user).success(function(res){
                            changeUser(res);
                            success(res);
                        }).error(error);
                    },
                    signout: function(success, error) {
                        $http.post('/signout').success(function(res){
                            changeUser({
                                username: '',
                                role: userRoles.public
                            });
                            success(res);
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
                    checkName: function(loginName){
                        var deferred = $q.defer();
                        var message = {
                            isExist: false,
                            message: ''
                        };
                        $http.post('/checkloginname', {loginName: loginName}).success(function(res){
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
                    user: currentUser,
                    loginStatus: loginStatus,
                    showSigninModal: showSigninModal
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