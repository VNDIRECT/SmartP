angular.module('myApp.chart', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/chart', {
        templateUrl: 'chart/chart.html',
        // selecting the controller we want here
        controller: 'GaugeCtrl'
        // controller: 'BarCtrl'

    });
}]);
