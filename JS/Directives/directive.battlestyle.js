app.directive('battlestyle', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/battlestyle.html',
        scope: {
            battleStyle: "=battlestyle",
            sysdata: "=sysdata"
        },
        link: function($scope, element, attrs) {
        }
    };
 });