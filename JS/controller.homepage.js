app.controller('HomepageCtrl', ['$scope', '$http', '$location', '$cookies', '$mdTheming', function ($scope, $http, $location, $cookies, $mdTheming) {
    //Initalize variables
    $scope.teamList = [];
    $scope.loadingTeams = true;

    $http({
        method: "GET",
        url: "https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/teamList"
    }).then(function successCallback(response) {
        $scope.teamList = response.data;
        $scope.loadingTeams = false;
    },function errorCallback(response){
        $scope.loadingTeams = false;
    });

    $scope.navigateToInfo = function(){ $location.path("/info"); };
    $scope.navigateToMap = function(teamName){ $location.path(teamName.replaceAll(' ', '') + '/map'); };
    $scope.navigateToConvoy = function(teamName){ $location.path(teamName.replaceAll(' ', '') + '/convoy'); };
    $scope.navigateToShop = function(teamName){ $location.path(teamName.replaceAll(' ', '') + '/shop'); };

    $scope.getAppTheme = function(){
        return $mdTheming.defaultTheme();
    };

    $scope.browserPrefersDarkMode = function(){
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    $scope.toggleAppTheme = function(){
        var theme = $mdTheming.defaultTheme();
        if(theme == 'default') theme = 'dark';
        else theme = 'default';

        $cookies.put('RedditEmblemMaps-SavedTheme', theme)
        location.reload();
    };
}]);