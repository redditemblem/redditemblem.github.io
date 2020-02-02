app.controller('HomepageCtrl', ['$scope', '$http', '$location', '$cookies', '$mdTheming', function ($scope, $http, $location, $cookies, $mdTheming) {
    //Initalize variables
    $scope.teamList = [];

    $http({
        method: "GET",
        url: "https://localhost:44380/api/teamList"
    }).then(function successCallback(response) {
        $scope.teamList = response.data;
    });

    $scope.LaunchInfo = function(){
        $location.path("/info");
    };

    $scope.LaunchMap = function(teamName){
        $location.path('/map/' + teamName.replace(' ', ''));
    };

    $scope.getAppTheme = function(){
        return $mdTheming.defaultTheme();
    };

    $scope.toggleAppTheme = function(){
        var theme = $mdTheming.defaultTheme();
        if(theme == 'default') theme = 'dark';
        else theme = 'default';

        $cookies.put('RedditEmblemMaps-SavedTheme', theme)
        location.reload();
    };
}]);