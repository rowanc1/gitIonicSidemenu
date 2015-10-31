angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
  });

//  Tap/Drag vars
    
    
       var entries = getAllEntries();
                        entries.sort(function(a,b) {
                        var aForm = a["display_form"][0];
                        var bForm = b["display_form"][0];
                        return aForm.localeCompare(bForm);
                });
    
        var startIndex = 0;
        
        var tenEntries = get10(entries, startIndex);
    
// Init functions
    $scope.init = function () {
var entries = getAllEntries();
                        entries.sort(function(a,b) {
                        var aForm = a["display_form"][0];
                        var bForm = b["display_form"][0];
                        return aForm.localeCompare(bForm);
                });
    
        var startIndex = 0;
        
        var tenEntries = get10(entries, startIndex);
     $("#browseEntries").html(tenEntries.join(""));
      
  };
    
// Tap Buttons
    
    $scope.onTapRandom = function () {
            
         $('#randomEntries').html(getRandom10());
       
    }; 
    
    
//    $scope.onTapBrowse = function () {
//        
//        
//                $("#browseEntries").html(tenEntries.join(""));
//    
//            }; // Browse condition end
    
    $scope.prev10 = function () {
        if ((startIndex - 10) > 0) {
        startIndex -= 10;
        tenEntries = get10(entries, startIndex);
$("#browseEntries").html(tenEntries.join(""));
        console.log(startIndex);
        } else {
        startIndex = 0;
        tenEntries = get10(entries, startIndex);
$("#browseEntries").html(tenEntries.join(""));
        console.log(startIndex);
        };   
};
    
    $scope.next10 = function () {
        startIndex += 10;
        tenEntries = get10(entries, startIndex);   $("#browseEntries").html(tenEntries.join(""));
        console.log(startIndex);
    };
    
}) 


.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});