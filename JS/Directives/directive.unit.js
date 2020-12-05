app.directive('unit', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/unit.html',
        scope: {
            unit: "=unit",
            tileconsts: "=tileconsts"
        }
    };
 });