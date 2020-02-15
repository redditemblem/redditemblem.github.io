app.controller('MapCtrl', ['$scope', '$http', '$window', '$routeParams', '$mdSidenav', function ($scope, $http, $window, $routeParams, $mdSidenav) {
    
    $scope.data = {};
    $scope.loadComplete = false
    $scope.unitInfoExpanded = false;
    $scope.statsExpanded = false;
    $scope.invExpanded = true;
    $scope.skillsExpanded = true;
    
    //Call API to fetch JSON on load
    $http({
        method: "GET",
        url: "https://localhost:44380/api/team/" + $routeParams.teamName
    }).then(function successCallback(response) {
        $scope.data = response.data;
        $scope.loadComplete = true;
    },function errorCallback(response){
        if(response.data == null)
            //Set manual error context
            $scope.errorContext = { 'message': 'The API endpoint could not be reached.' };
        else{
            $scope.errorContext = response.data;
            $scope.errorContext.status = response.status;
        }     
    });

    $scope.formatStackTrace = function(stacktrace){
        return stacktrace.replace("\tat", "\nat").trim();
    };

    // SIDE NAV FUNCTIONS ---------s--------------------------------

    $scope.openSideNav = function(){
        $mdSidenav("sidenav").open();
    };

    $scope.closeSideNav = function(){
        $mdSidenav("sidenav").close();
    };

    $scope.browserWidthCheck = function(){
        return $window.innerWidth < 500;
    };

    $scope.launchChapterPostTab = function(){
        $window.open($scope.data.map.chapterPostURL);
    };

    $scope.unitSort = function(unit){
        var sort = 0;
        if(unit.pinned) sort -= 2;
        if(unit.coordinates.x < 1 || unit.coordinates.y < 1) sort += 1;
        return sort;
    };

    //-------------------------------------------------------------

    $scope.mapTile_OnMouseover = function(tile){
        if(tile.occupyingUnitName.length > 0){
            var imgSprite = document.getElementById(tile.occupyingUnitName + "_sprite");
            if(imgSprite.classList.contains("grayscaleSprite")) imgSprite.classList.add("grayscaleSpriteHover");
            else imgSprite.classList.add("unitSpriteHover");
        }
    };

    $scope.mapTile_OnMouseout = function(tile){
        if(tile.occupyingUnitName.length > 0){
            var imgSprite = document.getElementById(tile.occupyingUnitName + "_sprite");
            imgSprite.classList.remove("grayscaleSpriteHover");
            imgSprite.classList.remove("unitSpriteHover");
        }
    };

    $scope.mapTile_OnClick = function(tile){
        if(tile.occupyingUnitName.length > 0){
            var unit = $scope.getUnitByName(tile.occupyingUnitName);
            unit.pinned = true;
            this.search.selected = unit;
        }
    };

    $scope.getUnitByName = function(unitName){
        return $scope.data.units.find((u) => { return u["name"] === unitName });
    };
}]);