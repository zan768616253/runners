(function(){
    app
        .controller('SignUpController', ['Auth', 'ngFoobar', '$state', '$timeout',
            function(Auth, ngFoobar, $state, $timeout){
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
                        }, function(){
                            ngFoobar.setOpacity(0.8);
                            ngFoobar.setAutoClose(true, 2000);
                            ngFoobar.show("success", "Congratulations, Register Successfully");

                            $timeout(function(){
                                $state.go('register_userinfo');
                            }, 1700);
                        }, function(err){

                        });
                        //clearForm();
                    } else {
                        ngFoobar.setOpacity(0.8);
                        ngFoobar.setAutoClose(true, 3000);

                        var invalidMsgs = ctrl.signupForm.$error;
                        var invalidMsgAttrs = Object.keys(ctrl.signupForm.$error);
                        if (invalidMsgs && angular.isArray(invalidMsgs[invalidMsgAttrs[0]]) && invalidMsgs[invalidMsgAttrs[0]].length > 0){
                            var invalidMsg = invalidMsgs[invalidMsgAttrs[0]][0];
                            ngFoobar.show("error", invalidMsg.$name + ' is ' + invalidMsgAttrs[0]);
                        } else{
                            ngFoobar.show("error", "Server Error");
                        }
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