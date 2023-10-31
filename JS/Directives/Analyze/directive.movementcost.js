app.directive('movementcost', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/Analyze/movementCost.html',
        scope: {
            terraindata: "=terraindata",
            selectedmovtype: "=selectedmovtype",
            selectedindex: "=selectedindex"
        },
        link: function($scope, element, attrs) {

            function getMovementCost(){
                var statGroup;
                if($scope.selectedindex == 0) statGroup = $scope.terraindata.statGroups[0];
                else statGroup = $scope.terraindata.statGroups.find((g) => g.searchIndex != undefined && g.searchIndex.indexOf($scope.selectedindex) > -1);
    
                if(statGroup == undefined) $scope.movCost = 0;
                else $scope.movCost = statGroup.movementCosts[$scope.selectedmovtype];
            };

            $scope.$watch('selectedmovtype', function(newVal, oldVal){
                getMovementCost();
            });

            $scope.$watch('selectedindex', function(newVal, oldVal){
                getMovementCost();
            });

            getMovementCost();
        }
    };
 });