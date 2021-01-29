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

            $scope.moveTurnUp = function(){
                var target = $scope.$parent.turnData.submittedTurns.find((t) => { return t["turnOrder"] === $scope.turn.turnOrder - 1 });
                if(target != null)
                {
                    $scope.turn.turnOrder -= 1;
                    target.turnOrder += 1;
                }
            };

            $scope.moveTurnDown = function(){
                var target = $scope.$parent.turnData.submittedTurns.find((t) => { return t["turnOrder"] === $scope.turn.turnOrder + 1 });
                if(target != null)
                {
                    $scope.turn.turnOrder += 1;
                    target.turnOrder -= 1;
                }
            };
        }
    };
 });