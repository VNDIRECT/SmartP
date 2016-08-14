'use strict';

var SMARTP_API_URL = 'https://script.google.com/macros/s/AKfycbweSsf8cPPk__HDZiWxszJ2HdV6s3zJU8WKEErqm41TT3CeI9k/exec';

// /**
// Yet another version of API which use angular $http provder
// This has to change. Do we want to depend on Angular 1 in the future??
// */
// function smartP_api($http) {
//     function _build_engineP_params(input) {
//         var symbols = [];
//         var quantities = [];

//         for(var key in input) {
//             symbols.push(key);
//             quantities.push(input[key]);
//         }

//         return 'symbols=' + symbols.join(',') + '&' + 'quantities=' + quantities.join(',');
//     }

//     return {
//         /**
//         Accept a json obj:
//         {symbols: {VND: 100, SSI: 100}, cash: 1000}

//         Callback with:
//         {risk: 0.9, expectedReturn: -1.2}
//         */
//         compute: function(input, callback, errorCallback) {
//             var url = SMARTP_API_URL + '?' + _build_engineP_params(input);
//             console.log('Start computing!...', url);
//             $http({
//               method: 'GET',
//               url: url
//             }).then(function successCallback(response) {
//                 callback({
//                     risk: response.data.risk,
//                     expectedReturn: response.data.expectedReturn
//                 });
//               }, function errorCallback(response) {
//                 console.log('Error ', response);
//                 // called asynchronously if an error occurs
//                 // or server returns response with an error status.
//               });

//         }
//     }
// }


angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl'
    });
}])

.controller('View2Ctrl', ['$scope', '$http', function($scope, $http) {
    $scope.symbol = $scope.symbol || 'VND';
    $scope.compute_smartP = function() {
        var api = smartP_api($http);
        api.compute({VND: $scope.vnd_quantity || 0, SSI: $scope.ssi_quantity || 0}, function(result) {
            console.log('Computing process has been done with result: ', result);
            $scope.risk = result.risk;
            $scope.expectedReturn = result.expectedReturn;
        }, function errorCallback(error) {
            console.log('error while compute smartP', error);
        });
    }
}]);