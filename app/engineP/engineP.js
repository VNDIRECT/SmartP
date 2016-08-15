'use strict';

angular.module('myApp.engineP', [])

.factory('engineP', ['$http', function($http) {

    var SMARTP_API_URL = 'https://script.google.com/macros/s/AKfycbweSsf8cPPk__HDZiWxszJ2HdV6s3zJU8WKEErqm41TT3CeI9k/exec';
    // var SMARTP_API_URL = 'http://localhost:5000';

    /**
    Yet another version of API which use angular $http provder
    This has to change. Do we want to depend on Angular 1 in the future??
    */
    function smartP_api($http) {
        function _build_engineP_params(input) {
            var symbols = [];
            var quantities = [];

            for(var key in input) {
                symbols.push(key);
                quantities.push(input[key]);
            }

            return 'symbols=' + symbols.join(',') + '&' + 'quantities=' + quantities.join(',');
        }

        /**
        Nicely display number so that client don't have to care
        */
        function _format_number(input) {
            console.log('Formatting', input);
            return input.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }

        return {
            /**
            Accept a json obj:
            {symbols: {VND: 100, SSI: 100}, cash: 1000}

            Callback with:
            {risk: 0.9, expectedReturn: -1.2}
            */
            compute: function(input, callback, errorCallback) {
                var url = SMARTP_API_URL + '?' + _build_engineP_params(input);
                console.log('Start computing view 1...', url);
                $http({
                  method: 'GET',
                  url: url
                }).then(function successCallback(response) {
                    callback(response.data);
                    // callback({
                    //     risk: _format_number(response.data.risk),
                    //     expectedReturn: _format_number(response.data.expectedReturn)
                    // });
                  }, function errorCallback(response) {
                    console.log('Error ', response);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                  });

            }
        }
    }

    return smartP_api($http);
}]);