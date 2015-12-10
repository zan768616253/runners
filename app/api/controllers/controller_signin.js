(function(){
    app
        .controller('SignInController', ['Auth', 'close', '$rootScope', '$scope', '$timeout', '$element',
            function(Auth, close, $rootScope, $scope, $timeout, $element){
                var echo = '';

                var resetEchoMsg = function() {
                    $timeout(function(){
                        $scope.echo = '';
                    }, 3000)
                };

                var closeModal = function() {
                    $element.modal('hide');
                    close(null, 500);
                };

                var cancel = function() {
                    closeModal();
                };

                var signin = function(isValid) {
                    if (isValid) {
                        Auth.signin({
                                email: $scope.emial,
                                password: $scope.password
                        }, function(res) {
                            switch (res.status.code){
                                case 200:
                                    var token = res.data.token;
                                    var user = res.data.user;
                                    Auth.setAuth('Token', token);
                                    Auth.setAuth('User', user);
                                    $rootScope.$broadcast(Auth.loginStatus.Success);
                                    closeModal();
                                    break;
                                default:
                                    $scope.echo = '不行啊！今天服务器有问题';
                                    break;
                            };
                        }, function(err) {

                        })
                    } else {
                        $scope.echo = '不行啊！有错误哦！';
                        resetEchoMsg();
                    }
                }

                $scope.echo = echo;
                $scope.emial = 's@qq.com';
                $scope.password = 's';

                $scope.signin = signin;
                $scope.cancel = cancel;

            }]
        );
})()