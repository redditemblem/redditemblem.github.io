app.directive('engraving', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/engraving.html',
        scope: {
            sysdata: "=sysdata"
        },
        link: function($scope, element, attrs) {
        }
    };
 });