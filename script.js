// Code goes here
(function() {
  var app = angular.module('ngJcropDemo', ['ngJcrop', 'ngAnimate', 'ui.bootstrap']);
  app.config(function(ngJcropConfigProvider) {
    ngJcropConfigProvider.setJcropConfig({
      bgColor: 'black',
      bgOpacity: .4,
      aspectRatio: 1,
      maxWidth: 300,
      maxHeight: 300
    });
    // Used to differ the upload example
    ngJcropConfigProvider.setJcropConfig('upload', {
      bgColor: 'red',
      bgOpacity: .6,
      aspectRatio: 1,
      maxWidth: 300,
      maxHeight: 300
    });
  });
  
  app.controller('DemoControllerUpload', function($scope, $uibModal, $log) {
    //Passing obj to ModalInstanceCtrl
    $scope.obj = {
      src: "",
      selection: [],
      thumbnail: true
    };
    // To open the dialog on click of input type file
    $scope.openDialog = function() {
      open();
    };
    // This makes dialog animate from top to bottom
    $scope.animationsEnabled = true;

    function open(size) {
      console.log('inside open');
      //Opening dialog with myModalContent.html template and ModalInstanceCtrl controller
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          obj: function() {
            return $scope.obj;
          }
        }
      });

      modalInstance.result.then(function(obj) {
        //Passed object from line 118
        $scope.obj = obj;
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }
  });
  
  app.directive('sbLoad', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var fn = $parse(attrs.sbLoad);
        elem.on('load', function(event) {
          scope.$apply(function() {
            fn(scope, {
              $event: event
            });
          });
        });
      }
    };
  }]);
  
  app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, obj) {
    // Getting the passed obj
    $scope.obj = obj;
    // Enable and Disable crop and upload button
    $scope.settings = {
      crop: true,
      upload: false,
    };
    // ng-jcrop option to show thumbnail
    $scope.obj.thumbnail = true;
    // crop function run on click of crop button
    $scope.crop = function() {
      // Create a cropped image with the user selection.
      var imgValue = {
        x1: $scope.obj.selection[0],
        y1: $scope.obj.selection[1],
        x2: $scope.obj.selection[2],
        y2: $scope.obj.selection[3],
        width: $scope.obj.selection[4],
        height: $scope.obj.selection[5],
      };
      //Creating canvas that will store the image into canvas and configuration
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext('2d');
      var img = new Image();
      // sbLoad directive will load the function onImgLoad
      $scope.onImgLoad = function(event) {
        canvas.height = imgValue.height;
        canvas.width = imgValue.width;
        context.drawImage(img, imgValue.x1, imgValue.y1, imgValue.width, imgValue.height, 0, 0, imgValue.width, imgValue.height);
        canvas.toDataURL($scope.obj.src);
      };
      img.src = $scope.obj.src;
      $scope.img = img;
      $scope.settings = {
        crop: false,
        upload: true,
      };
    };

    $scope.upload = function() {
      //Here you can call the BE method and store the canvas to DB.
      //passing obj back to DemoControllerUpload
      $uibModalInstance.close($scope.obj);
    };
    
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
})();