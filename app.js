// дэлгэцтэй ажиллах конторллер
var uiController = (function() {})();

// Санхүүтэй ажиллах конторллер
var financeController = (function() {})();

 // Программын холбогч конторллер
var appController = (function(uiController, financeController) {
  var ctrlAddItem = function() {
    // 1. оруулах өгөгдлийг дэлгэцнээс олж авах.
    console.log("дэлгэцнээс өгөгдлөө авах хэсэг");
    // 2. Олж авсан өгөгдлүүдээ санхүүгийн конторолл?рт дамжуулж тэнд хадаглах.
    // 3. Олж авсан өгөгдлөө вэб дээр тохирох хэсэгт гаргана
    // 4. Төсөвийг тооцоолно
    // 5. Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргах.
  };

  document.querySelector(".add__btn").addEventListener("click", function() {
    ctrlAddItem(); // ctrlAddItem дуудаж байна
  }); // хулганаас товчлуур дээр дарах

  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem(); // ctrlAddItem дуудаж байна 
                     //event.which хуучин хөтөч дээр дуудагдана
    }
  }); // интэр дарах үеийн код --- код нь 13
})(uiController, financeController);