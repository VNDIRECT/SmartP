'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'engineP', 'tradeapi', function($scope, engineP, tradeapi) {

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

            remove: function(index) {
                this.data.splice(index, 1);
            },

            /**
            Return the current portfolio in a nice JSON format
            */
            get_json: function() {
                return this.data.reduce(function(o, cur, next) {
                    o[cur.symbol] = cur.quantity;
                    return o;
                }, {});
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
        compute_smartP();
    };

    $scope.remove_symbol = function(index) {
        $scope.portfolio.remove(index);
        compute_smartP();
    };

    $scope.reset = function() {
        $scope.portfolio.init();
        compute_smartP();
    };

    function compute_smartP() {
    // $scope.compute_smartP = function() {
        // tradeapi.login('thangnt.nhtck47', 'vnds@1234')
        // .then(
        //     function(data) {
        //         console.log('Logged in success', data);
        //         tradeapi.retrieve_customer().then(function(data) {
        //             console.log('Customer info', data);
        //         })
        //     },
        //     function(message) {
        //         console.log('Loggin error', message);
        //     }
        // );


        engineP.compute($scope.portfolio.get_json(), function(result) {
            console.log('Computing process has been done with result: ', result);
            $scope.indicator = result;
        }, function errorCallback(error) {
            console.log('error while compute smartP', error);
        });

    }
}]);
