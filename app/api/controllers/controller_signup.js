(function(){
    app
        .controller('SignUpController', function(){
            var ctrl = this;
            var newUser = { email:'', userName:'', password:'' };

            var signup = function () {
                if( ctrl.signupForm.$valid) {
                    ctrl.showSubmittedPrompt = true;
                    clearForm();
                }
            };

            var clearForm = function () {
                ctrl.newCustomer = { email:'', userName:'', password:'' }
                ctrl.signupForm.$setUntouched();
                ctrl.signupForm.$setPristine();
            };

            var getPasswordType = function () {
                return ctrl.signupForm.showPassword ? 'text' : 'password';
            };

            var hasErrorClass = function (field) {
                if(field == 'email'){
                    ctrl.showEmailError = ctrl.signupForm['email'].$touched && ctrl.signupForm['email'].$invalid;
                } else if(field == 'userName'){
                    ctrl.showUsernameError = ctrl.signupForm['userName'].$touched && ctrl.signupForm['userName'].$invalid;
                }
                return ctrl.signupForm[field].$touched && ctrl.signupForm[field].$invalid;
            };

            var showMessages = function (field) {
                return ctrl.signupForm[field].$touched || ctrl.signupForm.$submitted
            };

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

            ctrl.showPasswordPrompt = false;
            ctrl.showPasswordError = false;

            ctrl.showSubmittedPrompt = true;
            ctrl.toggleEmailPrompt = toggleEmailPrompt;
            ctrl.toggleUsernamePrompt = toggleUsernamePrompt;
            ctrl.getPasswordType = getPasswordType;
            ctrl.hasErrorClass = hasErrorClass;
            ctrl.showMessages = showMessages;
            ctrl.newUser = newUser;
            ctrl.signup = signup;
            ctrl.clearForm = clearForm;
        })
})()