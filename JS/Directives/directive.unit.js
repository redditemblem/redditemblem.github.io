app.directive('unit', ['$interval', function($interval) {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/unit.html',
        scope: {
            unit: "=unit",
            tileconsts: "=tileconsts",
            tagsysdata: "=tagsysdata"
        },
        link: function($scope, element, attrs) {
            $scope.tagIterator = 0;
            $scope.filteredTagList = [];

            for(var index in $scope.unit.tags){
                var tag = $scope.unit.tags[index];
                if($scope.tagsysdata[tag].showOnUnit)
                    $scope.filteredTagList.push(tag);
            }
            
            function iterateTag(){
                if($scope.tagIterator == $scope.filteredTagList.length-1) $scope.tagIterator = 0;
                else $scope.tagIterator += 1;
            };

            //Only set up interval event if we have more than one tag
            if($scope.filteredTagList.length > 1)
                $interval(iterateTag, 2000);
        }
    };
 }]);