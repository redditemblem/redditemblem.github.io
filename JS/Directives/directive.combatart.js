app.directive('combatart', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/combatart.html',
        scope: {
            combatart: "=combatart",
            sysdata: "=sysdata",
            tagsysdata: "=tagsysdata"
        },
        link: function($scope, element, attrs) {
            $scope.expanded = false; //start collapsed

            $scope.expandCombatArtDisplay = function(){
                $scope.expanded = !$scope.expanded;
            };
        }
    };
 });