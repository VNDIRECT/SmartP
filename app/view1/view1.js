'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'engineP', 'tradeapi', function($scope, engineP, tradeapi) {
    $scope.symbol = $scope.symbol || 'VND';
    $scope.compute_smartP = function() {
        tradeapi.login('thangnt.nhtck47', 'vnds@1234')
        .then(
            function(data) {
                console.log('Logged in success', data);
                tradeapi.retrieve_customer().then(function(data) {
                    console.log('Customer info', data);
                })
            },
            function(message) {
                console.log('Loggin error', message);
            }
        );

        console.log('Logging in...');
        engineP.compute({VND: $scope.vnd_quantity || 100, SSI: $scope.ssi_quantity || 200}, function(result) {
            console.log('Computing process has been done with result: ', result);
            $scope.risk = result.risk;
            $scope.expectedReturn = result.expectedReturn;
        }, function errorCallback(error) {
            console.log('error while compute smartP', error);
        });
    }
}]);