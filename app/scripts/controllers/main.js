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
          $scope.searching = true;
          $.getJSON(url, {
              type: "GET",
              filter: "name:" + searchString,
              api_key: $scope.key,
              format: "json"
          })
          .done(function (data) {
              if(data.results.length > 0){
                $scope.searchResults = data.results;
              } else {
                console.log("No Results");
              }

              $scope.searching = false;
              $scope.$apply();
          })
          .fail(function (err) {
              console.log(err);
              $scope.searching = false;
          });
      };

      function getColor(){
        var img = new Image(100,100);
        var url = $("#hero")[0].style.backgroundImage;
        url = url.slice(5);
        url = url.slice(0, -2);
        img.setAttribute('src', url);
        img.crossOrigin = 'anonymous';
        img.addEventListener('load', function() {
          var vibrant = new Vibrant(img);
          var swatches = vibrant.swatches();
          // radial-gradient(circle, #4c8cbc, #1a3c45)
          $(".current-event").css("background", "linear-gradient(to right, #E2E2E2, " + swatches.LightVibrant.getHex() + ")");
          $(".stat-div").css("background", "radial-gradient(circle, #FFF," + swatches.Muted.getHex() + ")");
          $(".search-top").css("background", "radial-gradient(circle," +  swatches.Vibrant.getHex() + "," + swatches.DarkVibrant.getHex() + ")");
        });
      }

      function selectHero(result){
        $scope.selectedResult = result;
        console.log($scope.selectedResult);
        var background = "url(" +  result.image.super_url + ")";
        $('.hero').css('background-image', background);
        
        $("#current-event").empty();
        $("#current-event").append(result.description);

        //Set publisher logo
        if(result.publisher.name == "Marvel"){
          $scope.publisher = "/images/marvel-logo.jpg";
        } else if (result.publisher.name == "DC Comics") {
          $scope.publisher = "/images/dc.png";
        } else {
          $scope.publisher = "/images/not-avail.svg";
        }

        getColor();
        

        //Prettify gender
        if(!isNaN(result.gender)){
          if(result.gender === 0 || result.gender === 2){
            $scope.selectedResult.gender = "Female";
          } else {
            $scope.selectedResult.gender = "Male";
          }
        }
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