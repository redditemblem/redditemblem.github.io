app.directive('unit', ['$interval', function($interval) {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/unit.html',
        scope: {
            unit: "=unit",
            tileconsts: "=tileconsts",
            statussysdata: "=statussysdata",
            tagsysdata: "=tagsysdata"
        },
        link: function($scope, element, attrs) {
            $scope.statusIterator = 0;
            $scope.tagIterator = 0;
            
            $scope.statusSpriteList = [];
            $scope.tagSpriteList = [];

            //Build status list
            var addGenericStatusSprite = false;
            for(var index in $scope.unit.statusConditions){
                var status = $scope.unit.statusConditions[index];
                var statusData = $scope.statussysdata[status.name];
                if(statusData.spriteURL.length > 0)
                    $scope.statusSpriteList.push(statusData.spriteURL);
                else addGenericStatusSprite = true;
            }

            if(addGenericStatusSprite)
                $scope.statusSpriteList.push("IMG/status_heart.png");

            //Build tag list
            for(var index in $scope.unit.tags){
                var tag = $scope.unit.tags[index];
                var tagData = $scope.tagsysdata[tag];
                if(tagData.showOnUnit && tagData.spriteURL.length > 0)
                    $scope.tagSpriteList.push(tagData.spriteURL);
            }
            
            function iterateSprites(){
                if($scope.statusIterator == $scope.statusSpriteList.length-1) $scope.statusIterator = 0;
                else $scope.statusIterator += 1;

                if($scope.tagIterator == $scope.tagSpriteList.length-1) $scope.tagIterator = 0;
                else $scope.tagIterator += 1;
            };

            //Only set up interval event if we have a list with more than one sprite
            if(   $scope.statusSpriteList.length > 1
               || $scope.tagSpriteList.length > 1)
                $interval(iterateSprites, 2000);

            
            //Copy of controller function, only run on image load to initially style sprite
            const dimBrightness = "50"
            const grayscale = "95";
            const grayscaleModified = "70";

            var imgSprite = element.find('img'); //grabs first image in directive?
            imgSprite.bind('load', function () {
                var sprite = document.getElementById($scope.unit.name + "_sprite");

                var brightnessValue = "100";
                var grayscaleValue = "0";
        
                if(!$scope.unit.location.isBackOfPair){
                    if($scope.unit.sprite.hasMoved) grayscaleValue = grayscale;
                }
                else{
                    brightnessValue = dimBrightness;
                    if($scope.unit.sprite.hasMoved) grayscaleValue = grayscaleModified;
                }

                var filterString = `brightness(${brightnessValue}%) grayscale(${grayscaleValue}%)`;
                if($scope.unit.sprite.aura.length > 0)
                    filterString += `drop-shadow(0px 0px 3px ${$scope.unit.sprite.aura}) drop-shadow(0px 0px 2px ${$scope.unit.sprite.aura})`;
                sprite.style.filter = filterString;
            });
        }
    };
 }]);