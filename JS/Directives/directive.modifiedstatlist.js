app.directive('modifiedstatlist', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/modifiedstatlist.html',
        scope: {
            statList: "=data",
            expanded: "=expanded"
        }
    };
 });