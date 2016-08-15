'use strict';

var SMARTP_API_URL = 'https://script.google.com/macros/s/AKfycbweSsf8cPPk__HDZiWxszJ2HdV6s3zJU8WKEErqm41TT3CeI9k/exec';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl'
    });
}])

.directive('hcPieChart', function() {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '=',
            chart: '=',
        },
        link: function(scope, element) {

            var chart = Highcharts.chart(element[0], {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: scope.title
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %s'
                        }
                    }
                },
                series: [{
                    data: scope.data
                }]
            });

            scope.$watch('data', function() {
                console.log('Data updated', scope);
                chart.redraw();
            });
        }
    }
})

.controller('View2Ctrl', ['$scope', 'engineP', function($scope, engineP) {

    /**
    Sample highchart
    */
                // Sample data for pie chart
                $scope.pieData = [{
                        name: "Microsoft Internet Explorer",
                        y: 56.33
                    }, {
                        name: "Chrome",
                        y: 24.03,
                        sliced: true,
                        selected: true
                    }, {
                        name: "Firefox",
                        y: 10.38
                    }, {
                        name: "Safari",
                        y: 4.77
                    }, {
                        name: "Opera",
                        y: 0.91
                    }, {
                        name: "Proprietary or Undetectable",
                        y: 0.2
                }];

                setTimeout(function() {
                    console.log('YOLO');
                    $scope.pieData = [{
                            name: "Microsoft Internet Explorer",
                            y: 36.33
                        }, {
                            name: "Chrome",
                            y: 44.03,
                            sliced: true,
                            selected: true
                        }, {
                            name: "Firefox",
                            y: 10.38
                        }, {
                            name: "Safari",
                            y: 4.77
                        }, {
                            name: "Opera",
                            y: 0.91
                        }, {
                            name: "Proprietary or Undetectable",
                            y: 0.2
                    }];
                }, 2000);

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
}])
