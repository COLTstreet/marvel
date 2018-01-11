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
      $scope.key = "ef125a4927c7215d28cb0e93ffdc5deb506ff9ec";
      $scope.selectedResult = '';
      $scope.background = '';

      //Functions
      $scope.characterSearch = characterSearch;
      $scope.init = init;
      $scope.selectHero = selectHero;

      function characterSearch(searchString) {

          // you need a new ts every request                                                                                    
          var ts = new Date().getTime();
          var hash = CryptoJS.MD5(ts + $scope.PRIV_KEY + $scope.PUBLIC_KEY).toString();                                                                   
          var url = 'https://api-comic-vine.herokuapp.com/characters';
          $.getJSON(url, {
              type: "GET",
              filter: "name:" + searchString,
              api_key: $scope.key,
              format: "json"
          })
          .done(function (data) {
              if(data.results.length > 1){
                $scope.searchResults = data.results;
              } else {
                console.log("No Results");
              }

              $scope.$apply();
          })
          .fail(function (err) {
              console.log(err);
          });
      };

      function selectHero(result){
        $scope.selectedResult = result;
        var background = "url(" +  result.image.super_url + ")";
        $('.hero').css('background-image', background);
        
        $("#current-event").empty();
        $("#current-event").append(result.description);
      }

      function init() {
        $('.hamb-wrap').on('click', function(){
          $(this).parent().children('p').toggle();
          $(this).children().toggleClass('active');
          $('nav').fadeToggle(200);
        });
      }

      init();
  });