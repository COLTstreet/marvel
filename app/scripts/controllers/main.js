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
          var url = 'https://gateway.marvel.com/v1/public/characters';
          $.getJSON(url, {
              nameStartsWith: searchString,
              ts: ts,
              apikey: $scope.PUBLIC_KEY,
              hash: hash
          })
          .done(function (data) {
              if(data.data.results[0].length === 1){
                var background = "url(" +  data.data.results[0].thumbnail.path + "." + data.data.results[0].thumbnail.extension + ")";
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

          //TRYING COMIC VINE API
          $.ajax("https://comicvine.gamespot.com/api/characters", {
              type: "GET",
              filter: "name:" + searchString,
              api_key: $scope.key,
              format: "json"
          })
          .done(function (data) {
              console.log(data);
          })
          .fail(function (err) {
              console.log(err);
          });
      };

      function selectHero(result){
        console.log(result);
        $scope.selectedResult = result;
        var background = "url(" +  result.thumbnail.path + "." + result.thumbnail.extension + ")";
        $('.hero').css('background-image', background);
        
        // window.location.replace('/#!/about');
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