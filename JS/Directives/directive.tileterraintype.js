app.directive('tileterraintype', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/tileterraintype.html',
        scope: {
            tile: "=tile",
            sysdata: "=sysdata"
        }
    };
 });