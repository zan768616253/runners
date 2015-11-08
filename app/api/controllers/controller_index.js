/**
 * Created by zan on 10/18/15.
 */
(function(){
    app
        .controller('BodyController', ['$rootScope',
            function ($rootScope){

                $rootScope.totalHints = 0;
                $rootScope.isSignin = false;
            }
        ])
        .controller('NavbarController', ['$scope','$rootScope','$window','Auth','HintFactory',
            function($scope, $rootScope, $window, Auth, HintFactory){

                var isNeedFoldCurrent,
                    isNeedFoldCache,
                    isNeedFoldTopheader,
                    isNeedFoldTopheaderCache,
                    minWindowSize = 768;

                var isAuth = false;

                $scope.isAuth = isAuth;

                $scope.isFolded = isNeedFoldCache = isNeedFoldCurrent =  $window.document.documentElement.offsetWidth < minWindowSize ? true : false;
                $scope.isTopheaderFolded = isNeedFoldTopheader = isNeedFoldTopheaderCache = $window.document.documentElement.offsetWidth < minWindowSize ? true : false;

                $scope.toggleNavbar = function () {
                    if(isNeedFoldCurrent) {
                        $scope.isFolded = !$scope.isFolded;
                    }else{
                        $scope.isFolded = false;
                    }
                }

                $window.onresize = function() {
                    isNeedFoldCurrent = $window.document.documentElement.offsetWidth < 768 ? true : false
                    isNeedFoldTopheader = $window.document.documentElement.offsetWidth < 768 ? true : false;
                    if(isNeedFoldCache !== isNeedFoldCurrent && isNeedFoldTopheaderCache !== isNeedFoldTopheader) {
                        $scope.isFolded = isNeedFoldCache = isNeedFoldCurrent;
                        $scope.isTopheaderFolded = isNeedFoldTopheaderCache = isNeedFoldTopheader
                        $scope.$apply();
                    }
                }
            }
        ])
})()