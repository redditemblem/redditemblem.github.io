app.directive('submittedturn', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/submittedturn.html',
        scope: {
            turn: "=turn",
        },
        link: function($scope, element, attrs) {
            $scope.expanded = false; //start collapsed
        }
    };
 });