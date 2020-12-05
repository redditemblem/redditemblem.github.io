app.directive('currency', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/currency.html',
        scope: {
            amount: "=amount",
            format: "=format"
        }
    };
 });