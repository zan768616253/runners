(function(){
    app
        .controller('SignInController', ['Auth', '$rootScope', '$element', 'title', 'close',
            function(Auth, $rootScope, $element, title, close){
                var ctrl = this;

                ctrl.emial = null;
                ctrl.password = null;

                ctrl.close = function() {
                    close({
                        emial: ctrl.emial,
                        password: ctrl.password
                    }, 500);
                };

                ctrl.cancel = function() {
                    $element.modal('hide');
                    close({
                        emial: ctrl.emial,
                        password: ctrl.password
                    }, 500);
                };

                ctrl.signin = function() {

                }
            }]
        );
})()