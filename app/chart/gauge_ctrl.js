/**
It is a must that this file must be included AFTER barchart
*/

var chart = angular.module('myApp.chart')

.controller('GaugeCtrl', ['$scope', function($scope) {
    $scope.options = {
        size: 300,
        clipWidth: 300,
        clipHeight: 300,
        ringWidth: 60,
        maxValue: 5,
        transitionMs: 4000,
        height: 500,
    };

    $scope.gauge_value = Math.random() * 5;
}])

.directive('gaugeChart', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="power-gauge"></div>',
        scope:{
            options: '=options',
            height: '=height',
            value: '=value',
        },
        link: function(scope, element, attrs) {
            var chartEl = element[0];
            var chart = gauge_chart(chartEl, scope.options);
            chart.render();

            scope.$watch('value', function (newVal, oldVal) {
                console.log('Updating data in Gauge', newVal, oldVal);
                chart.update(newVal);
            });
        }
    }
});