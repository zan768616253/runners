/**
 * Created by zan on 11/28/15.
 */
(function(){
    app
        .factory('HintFactory', ['$http',
            function ($http){
                return {
                    getHintsCount: function (data, success, error) {
                    },
                    getAllHints: function (data, success, error) {
                    },
                    pullRequest: function (data, success, error) {
                    },
                    markHint: function (data, success, error) {
                    },
                    acceptHint: function (data, success, error) {
                    }
                };
            }
        ])
})()