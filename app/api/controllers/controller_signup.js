(function(){
    app
        .controller('SignUpController', ['Auth',
            function(Auth){
                var ctrl = this;
                var newUser = { email:'', loginName:'s', password:'s', passwordConfirmed:'s'};

                var signup = function () {
                    if( ctrl.signupForm.$valid) {
                        ctrl.showSubmittedPrompt = true;
                        Auth.register({
                            email: ctrl.newUser.email,
                            loginname: ctrl.newUser.loginName,
                            password: ctrl.newUser.password,
                            re_password: ctrl.newUser.passwordConfirmed
                        }, function(){}, function(err){});

                        //clearForm();
                    }
                };

                var clearForm = function () {
                    ctrl.newUser = { email:'', loginName:'', password:'' }
                    ctrl.signupForm.$setUntouched();
                    ctrl.signupForm.$setPristine();
                };

                var getPasswordType = function () {
                    return ctrl.signupForm.showPassword ? 'text' : 'password';
                };

                var hasErrorClass = function (field) {
                    return ctrl.signupForm[field].$touched && ctrl.signupForm[field].$invalid;
                };

                var showMessages = function (field) {
                    return ctrl.signupForm[field].$touched || ctrl.signupForm.$submitted
                };

                var showServerMessage = function (field) {
                    return (ctrl.signupForm[field].$touched || ctrl.signupForm.$submitted) && !showMessages(field);
                }

                var toggleEmailPrompt = function (value) {
                    ctrl.showEmailPrompt = value;
                }

                var toggleLoginNamePrompt = function (value) {
                    ctrl.showLoginNamePrompt = value;
                };

                ctrl.showEmailPrompt = false;
                ctrl.showEmailError = false;

                ctrl.showLoginNamePrompt = false;
                ctrl.showULoginNameError = false;

                ctrl.showPasswordPrompt = false;
                ctrl.showPasswordError = false;

                ctrl.showSubmittedPrompt = true;
                ctrl.toggleEmailPrompt = toggleEmailPrompt;
                ctrl.toggleLoginNamePrompt = toggleLoginNamePrompt;
                ctrl.getPasswordType = getPasswordType;
                ctrl.hasErrorClass = hasErrorClass;
                ctrl.showMessages = showMessages;
                ctrl.showServerMessage = showServerMessage;
                ctrl.newUser = newUser;
                ctrl.signup = signup;
                ctrl.clearForm = clearForm;
            }
        ])
})()