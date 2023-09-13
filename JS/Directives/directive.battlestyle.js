app.directive('battlestyle', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/battlestyle.html',
        scope: {
            battleStyle: "=battlestyle",
            sysdata: "=sysdata",
            label: "=label"
        },
        link: function($scope, element, attrs) {
        }
    };
 });