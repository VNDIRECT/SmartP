'use strict';

/**
This view requires a highchart
*/

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'engineP', 'tradeapi', function($scope, engineP, tradeapi) {

    $scope.is_logged_in = false;
    $scope.is_loading = false;
    $scope.is_simulated = false;
    function reset_indicator_to_default() {
        $scope.indicator = {
            beta: 0,
            expectedReturn: 0,
            maxDrawDown: 0,
            valueAtRisk:0
        };

        $scope.sim_indicator = {
            beta: 0,
            expectedReturn: 0,
            maxDrawDown: 0,
            valueAtRisk:0
        };
    }

    reset_indicator_to_default();

    /**
    Handle portfolio logic:
    If symbol exists when added, increase the current quantity instead

    For easy rendering with Angular, virtual change will be added to each real portfolio
    */
    function create_portfolio() {
        var default_data =
            [
                {symbol: 'VND', quantity: 200, change: -100},
                {symbol: 'SSI', quantity: 500, change: 100},
            ];
        return {
            data: [],

            /**
                return null if symbol does not exist
            */
            get_entry: function(symbol) {
                for(var i = 0; i < this.data.length; i++) {
                    if(this.data[i].symbol == symbol) {
                        return this.data[i];
                    }
                }
                return null;
            },

            add: function(symbol, quantity, change) {
                var entry = this.get_entry(symbol);
                if(entry) {
                    entry.quantity += quantity;
                }
                else{
                    this.data.push({symbol: symbol, quantity: quantity, change: change});
                }
            },

            remove: function(index) {
                this.data.splice(index, 1);
            },

            virtual_buy: function(symbol, quantity) {
                if(symbol && quantity) {
                    var entry = this.get_entry(symbol);
                    if(entry) {
                        entry.change += quantity;
                    }
                    else{
                        this.data.push({symbol: symbol, quantity: 0, change: quantity});
                    }
                }
            },

            virtual_sell: function(symbol, quantity) {
                if(symbol && quantity) {
                    var entry = this.get_entry(symbol);
                    if(entry) {
                        entry.change -= quantity;
                    }
                    // do nothing if there is no symbol in that portfolio
                }
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
            Return the virtual portfolio, which means include change
            */
            get_virtual_json() {
                return this.data.reduce(function(o, cur, next) {
                    o[cur.symbol] = cur.quantity + cur.change;
                    return o;
                }, {});
            },

            /**
            Load the init data into data
            */
            init: function(init_data) {
                var data = init_data || default_data;
                this.data.length = 0;
                for(var i = 0; i < data.length; i++) {
                    this.add(data[i].symbol, data[i].quantity, data[i].change);
                }
                return this;
            }

        }
    };

    function init_portfolio_list() {
        $scope.portfolio_list = [
            {id: '0001', name: 'Danh mục ảo 1'},
            {id: '0002', name: 'Danh mục ảo 2'},
        ];
        $scope.selectedP = $scope.portfolio_list[0].id;
    }

    init_portfolio_list();

    $scope.$watch('selectedP', function() {
        console.log('Update select', $scope.selectedP);
        $scope.portfolio = portfolio_store.get($scope.selectedP);
        compute_smartP();
    });

    /**
    Handle list of portfolio logic
    */
    function create_portfolio_store(p_list) {
        var portfolio_store = {};
        for(var i = 0; i < p_list.length; i++) {
            portfolio_store[p_list[i].id] = create_portfolio().init();
        }
        return {
            /**
            Select a portfolio
            */
            get: function(id) {
                return portfolio_store[id];
            },

            /**
            Add a new portfolio to list
            {
                id:
                name:
                data: {

                }
            }
            */
            add: function(portfolio) {
                portfolio_store[portfolio.id] = create_portfolio().init(portfolio.data);
            }
        }
    }

    var portfolio_store = create_portfolio_store($scope.portfolio_list);
    $scope.portfolio = portfolio_store.get($scope.selectedP);

    $scope.add_symbol = function() {
        // TODO: move add_symbol into a function itself?
        // this might help avoid leaking $scope variable
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

    $scope.buy_virtual_symbol = function() {
        $scope.portfolio.virtual_buy($scope.virtual_symbol, $scope.virtual_quantity);
        compute_smartP();
    };

    $scope.sell_virtual_symbol = function() {
        $scope.portfolio.virtual_sell($scope.virtual_symbol, $scope.virtual_quantity);
        compute_smartP();
    };

    $scope.reset = function() {
        portfolio_store.add({
            id: "0003",
            name: "My Portfolio",
            data: [
                {symbol: "VNM", quantity: 100}
            ]
        });
        $scope.portfolio_list.push({
            id: "0003",
            name: "My Portfolio"
        })
        $scope.selectedP = "0003";
        // $scope.portfolio.init();
        // compute_smartP();
    };

    $scope.retrieve_account = function(username, password) {
        console.log('Loggin in');
        tradeapi.login(username, password)
        // TODO: this is promise but still callback nested
        .then(
            function(data) {
                console.log('Logged in success', data);
                $scope.is_logged_in = true;
                tradeapi.retrieve_customer().then(function(data) {
                    console.log('Customer info', data);
                    $scope.full_name = data.customerName;
                    for(var i = 0; i < data.accounts.length; i++) {
                        tradeapi.retrieve_portfolio(data.accounts[i].accountNumber).then(function(data) {
                            console.log('Portfolio List', data);
                            // adding portfolio
                            $scope.portfolio_list.push({
                                id: data.accountNumber,
                                name: data.accountNumber
                            });
                            portfolio_store.add({
                                id: data.accountNumber,
                                name: data.accountNumber,
                                data: data.stocks.map(function(i) {i.change=0; return i})
                            });
                        });
                    }
                });
            },
            function(message) {
                console.log('Loggin error', message);
            }
        );
    }

    $scope.logout = function() {
        init_portfolio_list();
        $scope.portfolio.init();
        $scope.is_logged_in = false;
    }

    /**
    Handle cash
    */
    $scope.$watch('cash', function(data) {
        console.log('Cash changed', data);
        compute_smartP();
    });

    /**
    Call engineP and update all indicators
    */
    function compute_smartP() {
        $scope.is_loading = true;
        // reset_indicator_to_default();
        engineP.compute(
            {
                portfolio: $scope.portfolio.get_json(),
                cash: $scope.cash || 0
            },
            function(result) {
                console.log('Computing process has been done with result: ', result);

                setTimeout(function() {
                    $scope.indicator = result;

                    /**
                    Compute the virtual indicator and then diff
                    */
                    engineP.compute(
                        {
                            portfolio: $scope.portfolio.get_virtual_json(),
                            cash: $scope.cash || 0
                        },
                        function(result) {
                            console.log('Simulation done', result);
                            for(var key in result) {
                                $scope.sim_indicator[key] = - $scope.indicator[key] + result[key];
                            }
                            $scope.is_loading = false;
                        }
                        );

                }, 500);

            }, function errorCallback(error) {
                console.log('error while compute smartP', error);
            });
    }


    /**
    Gauge Chart Settings
    */
    $scope.gauge_options_beta = {
        size: 250,
        clipWidth: 250,
        clipHeight: 140,
        ringWidth: 50,
        minValue: -1,
        maxValue: 2,
        transitionMs: 4000,
        height: 500,
    };

    $scope.gauge_options_expectedReturn = {
        size: 250,
        clipWidth: 250,
        clipHeight: 140,
        ringWidth: 50,
        minValue: -50,
        maxValue: 50,
        transitionMs: 4000,
        height: 500,
    };
}])

/**
Allow format number in input
*/
.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });
        }
    };
}])

.filter('virtual_change', function() {
    return function(input) {
        if(parseFloat(input) >= 0) {
            return '+' + input;
        }
        else {
            return input;
        }
    }
});
