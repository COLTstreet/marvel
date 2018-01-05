'use strict';

/**
 * @ngdoc function
 * @name marvelApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the marvelApp
 */
angular.module('marvelApp')
    .controller('MainCtrl', function ($scope) {
      //Variables
      $scope.PRIV_KEY = "9913454860da8841daa86b9fa485eaaef8a5991a";
      $scope.PUBLIC_KEY = "7ca9c95a6ecf52f4b20a011c3c4117f8";

      //Functions
      $scope.characterSearch = characterSearch;
      $scope.init = init;
      $scope.goToAbout = goToAbout;

      function characterSearch(searchString) {

          // you need a new ts every request                                                                                    
          var ts = new Date().getTime();
          var hash = CryptoJS.MD5(ts + $scope.PRIV_KEY + $scope.PUBLIC_KEY).toString();                                                                   
          var url = 'http://gateway.marvel.com:80/v1/public/characters';
          $.getJSON(url, {
              nameStartsWith: searchString,
              ts: ts,
              apikey: $scope.PUBLIC_KEY,
              hash: hash
          })
          .done(function (data) {
              if(data.data.results[0].length == 1){
                let background = "url(" +  data.data.results[0].thumbnail.path + "." + data.data.results[0].thumbnail.extension + ")";
                $('.bg').css('background-image', background);
                window.location.replace('/#!/about');
              } else if(data.data.results.length > 1){
                $scope.searchResults = data.data.results;
              } else {
                console.log("No Results");
              }

              $scope.$apply();
          })
          .fail(function (err) {
              console.log(err);
          });
      };

      function goToAbout(result){
        let background = "url(" +  result.thumbnail.path + "." + result.thumbnail.extension + ")";
        $('.bg').css('background-image', background);
        window.location.replace('/#!/about');
      }

      function init() {
        $('.bg').css('background-image', "");
      }

      init();
  });