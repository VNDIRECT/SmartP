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

    /**
    Handle portfolio logic:
    If symbol exists when added, increase the current quantity instead
    */
    function create_portfolio() {
        var init_data =
            [
                {symbol: 'VND', quantity: 200},
                {symbol: 'SSI', quantity: 100},
            ];
        return {
            data: [],

            add: function(symbol, quantity) {
                for(var i = 0; i < this.data.length; i++) {
                    if(this.data[i].symbol == symbol) {
                        this.data[i].quantity += quantity;
                        return;
                    }
                }
                this.data.push({symbol: symbol, quantity: quantity});
            },

            /**
            Load the init data into data
            */
            init: function() {
                this.data.length = 0;
                for(var i = 0; i < init_data.length; i++) {
                    this.add(init_data[i].symbol, init_data[i].quantity);
                }
                return this;
            }

        }
    };

    $scope.portfolio = create_portfolio().init();

    $scope.add_symbol = function() {
        // simple validation to avoid empty string symbol input
        if($scope.pending_symbol.length > 0) {
            $scope.portfolio.add($scope.pending_symbol, $scope.pending_quantity);
            $scope.pending_quantity = 0;
            $scope.pending_symbol =  '';
        }
    }

    $scope.reset = function() {
        $scope.portfolio.init();
    }

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


        engineP.compute({VND: $scope.vnd_quantity || 100, SSI: $scope.ssi_quantity || 200}, function(result) {
            console.log('Computing process has been done with result: ', result);
            $scope.risk = result.risk;
            $scope.expectedReturn = result.expectedReturn;
        }, function errorCallback(error) {
            console.log('error while compute smartP', error);
        });

    }
}]);
