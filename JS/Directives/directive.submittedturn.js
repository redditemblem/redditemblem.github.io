app.directive('submittedturn', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/submittedturn.html',
        scope: {
            turn: "=turn",
            islast: '=islast'
        },
        link: function($scope, element, attrs) {
            $scope.showTurnHistory = false; //start collapsed

            $scope.toggleTurnHistory = function(){
                $scope.showTurnHistory = !$scope.showTurnHistory;
            };
        }
    };
 });