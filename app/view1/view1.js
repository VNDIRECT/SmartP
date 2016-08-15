'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'engineP', function($scope, engineP) {
    $scope.symbol = $scope.symbol || 'VND';
    $scope.compute_smartP = function() {
        engineP.compute({VND: $scope.vnd_quantity || 100, SSI: $scope.ssi_quantity || 200}, function(result) {
            console.log('Computing process has been done with result: ', result);
            $scope.risk = result.risk;
            $scope.expectedReturn = result.expectedReturn;
        }, function errorCallback(error) {
            console.log('error while compute smartP', error);
        });
    }
}]);