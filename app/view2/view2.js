'use strict';

var SMARTP_API_URL = 'https://script.google.com/macros/s/AKfycbweSsf8cPPk__HDZiWxszJ2HdV6s3zJU8WKEErqm41TT3CeI9k/exec';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl'
    });
}])

.controller('View2Ctrl', ['$scope', 'engineP', function($scope, engineP) {
    $scope.symbol = $scope.symbol || 'VND';
    $scope.compute_smartP = function() {
        engineP.compute({VND: $scope.vnd_quantity || 0, SSI: $scope.ssi_quantity || 0}, function(result) {
            console.log('Computing process has been done with result: ', result);
            $scope.risk = result.risk;
            $scope.expectedReturn = result.expectedReturn;
        }, function errorCallback(error) {
            console.log('error while compute smartP', error);
        });
    }
}]);