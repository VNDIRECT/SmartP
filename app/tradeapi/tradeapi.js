/**
This Angular module provide interface to VNDIRECT API, include:
- Auth API
- Trade API
*/

angular.module('myApp.tradeapi', [])

.factory('tradeapi', ['$http', '$q', function($http, $q) {
    var AUTH_URL = 'https://auth-api.vndirect.com.vn/auth';
    var CUSOMTER_URL = 'https://trade-api.vndirect.com.vn/customer';
    var PORTFOLIO_URL = 'https://trade-api.vndirect.com.vn/accounts/<accountNo>/portfolio';

    var token = null;

    return {
        login: function(username, password) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: AUTH_URL,
                data: {
                    username: username,
                    password: password
                }
            })
            .then(function(response) {
                deferred.resolve(response.data);
                token = response.data.token;
            }, function(response) {
                deferred.reject(response.data.message);
            });
            return deferred.promise;
        },

        /**
        Retrieve customer information such as cusid, name, accou
        */
        retrieve_customer: function() {
            var deferred = $q.defer();
            if(token) {
                $http({
                    method: 'GET',
                    url: CUSOMTER_URL,
                    headers: {
                        'X-AUTH-TOKEN': token
                    }
                })
                .then(function(response) {
                    deferred.resolve(response.data);
                }, function(response) {
                    deferred.reject(response.data.message);
                });
                return deferred.promise;
            }
            else{
                throw 'You are not logged in';
            }
        },

        retrieve_portfolio: function(accountNo) {
            var deferred = $q.defer();
            if(token) {
                $http({
                    method: 'GET',
                    url: PORTFOLIO_URL.replace('<accountNo>', accountNo),
                    headers: {
                        'X-AUTH-TOKEN': token
                    }
                })
                .then(function(response) {
                    deferred.resolve(response.data);
                }, function(response) {
                    deferred.reject(response.data.message);
                });
                return deferred.promise;
            }
            else{
                throw 'You are not logged in';
            }
        }

    };
}]);

