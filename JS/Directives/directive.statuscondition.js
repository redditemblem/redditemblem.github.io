app.directive('statuscondition', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/statuscondition.html',
        scope: {
            status: "=status",
            sysdata: "=sysdata"
        }
    };
 });