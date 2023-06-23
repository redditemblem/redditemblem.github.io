app.directive('engageattack', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/engageattack.html',
        scope: {
            engageattack: "=engageattack",
            sysdata: "=sysdata",
            expanded: "=expanded"
        },
        link: function($scope, element, attrs) {
            $scope.expanded = false; //start collapsed
        }
    };
 });