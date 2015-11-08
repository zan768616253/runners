(function(){
    app
        .controller('SignUpController', function(){
            var ctrl = this;

            var toggleEmailPrompt = function (value) {
                ctrl.showEmailPrompt = value;
            }

            var toggleUsernamePrompt = function (value) {
                ctrl.showUsernamePrompt = value;
            };

            ctrl.showEmailPrompt = false;
            ctrl.showEmailError = false;

            ctrl.showUsernamePrompt = false;
            ctrl.showUsernameError = false;

            ctrl.showSubmittedPrompt = true;
            ctrl.toggleEmailPrompt = toggleEmailPrompt;
            ctrl.toggleUsernamePrompt = toggleUsernamePrompt;
        })
})()