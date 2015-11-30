(function(){
    app
        .directive('existEmail', ['Auth', '$q', function (Auth, $q) {
            return {
                restrict: 'A',
                require:'ngModel',
                link: function(scope, elem, attrs, ngModelCtrl){
                    ngModelCtrl.$asyncValidators.existEmail = function(value){
                        var deferred = $q.defer();
                        Auth.checkEmail(value)
                            .then(function(message){
                                if(message.isExist){
                                    deferred.reject();
                                } else{
                                    deferred.resolve();
                                }
                            });
                        return deferred.promise;
                    }
                }
            }
        }])
        .directive('existLoginname', ['Auth', '$q', function (Auth, $q) {
            return {
                restrict: 'A',
                require:'ngModel',
                link: function(scope, elem, attrs, ngModelCtrl){
                    ngModelCtrl.$asyncValidators.existLoginname = function(value){
                        var deferred = $q.defer();
                        Auth.checkName(value)
                            .then(function(message){
                                if(message.isExist){
                                    deferred.reject();
                                } else{
                                    deferred.resolve();
                                }
                            });
                        return deferred.promise;
                    }
                }
            }
        }])
        .directive('compareTo', function(){
            return{
                restrict: 'A',
                require:'ngModel',
                scope:{
                    otherModelValue: "=compareTo"
                },
                link: function(scope, element, attributes, ngModelCtrl){
                    ngModelCtrl.$validators.compareTo = function(value){
                        return value == scope.otherModelValue;
                    };

                    scope.$watch("otherModelValue", function() {
                        ngModelCtrl.$validate();
                    });
                }
            }
        })
})()