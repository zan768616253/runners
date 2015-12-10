/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .controller('BodyController', ['$rootScope',
            function ($rootScope){
            }
        ])
        .controller('NavbarController', ['$scope','$rootScope','$window','Auth','HintFactory',
            function($scope, $rootScope, $window, Auth, HintFactory){
                var isAuth = false;
                $scope.isAuth = isAuth;

                var isNeedFoldCurrent,
                    isNeedFoldCache,
                    isNeedFoldTopheader,
                    isNeedFoldTopheaderCache,
                    minWindowSize = 768;

                $scope.isFolded = isNeedFoldCache = isNeedFoldCurrent =  $window.document.documentElement.offsetWidth < minWindowSize ? true : false;
                $scope.isTopheaderFolded = isNeedFoldTopheader = isNeedFoldTopheaderCache = $window.document.documentElement.offsetWidth < minWindowSize ? true : false;

                $scope.showSignin = Auth.showSigninModal;

                $scope.toggleNavbar = function () {
                    if(isNeedFoldCurrent) {
                        $scope.isFolded = !$scope.isFolded;
                    }else{
                        $scope.isFolded = false;
                    }
                };

                $window.onresize = function() {
                    isNeedFoldCurrent = $window.document.documentElement.offsetWidth < 768 ? true : false
                    isNeedFoldTopheader = $window.document.documentElement.offsetWidth < 768 ? true : false;
                    if(isNeedFoldCache !== isNeedFoldCurrent && isNeedFoldTopheaderCache !== isNeedFoldTopheader) {
                        $scope.isFolded = isNeedFoldCache = isNeedFoldCurrent;
                        $scope.isTopheaderFolded = isNeedFoldTopheaderCache = isNeedFoldTopheader
                        $scope.$apply();
                    }
                };

                $rootScope.$on(Auth.loginStatus.Success, function(){
                    $scope.isAuth = true;
                    $scope.user = Auth.getAuth('User');
                });

                $rootScope.$on(Auth.loginStatus.Failed, function(){
                    $scope.isAuth = false;
                })
            }
        ])
})()