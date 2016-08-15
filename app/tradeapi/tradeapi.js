/**
This Angular module provide interface to VNDIRECT API, include:
- Auth API
- Trade API
*/

angular.module('myApp.tradeapi', [])

.factory('tradeapi', ['$http', function($http) {
    var AUTH_URL = 'https://auth-api.vndirect.com.vn/auth';

    var token = null;

    return {
        login: function(username, password) {
            $http({
                method: 'POST',
                url: AUTH_URL,
                data: {
                    username: username,
                    password: password
                }
            })
            .then(function(response) {
                console.log('Login success', response);
            })
        },
    };
});

