// дэлгэцтэй ажиллах конторллер
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: '.income__list',
    expenseList: '.expenses__list'
  };

  return {
    getInput: function() {
      return {          
        type: document.querySelector(DOMstrings.inputType).value,    
        description: document.querySelector(DOMstrings.inputDescription).value, 
        value: parseInt ( document.querySelector(DOMstrings.inputValue).value )
      }; 
    },
    getDOMstrings: function() {
      return DOMstrings;
    },

    clearFields: function() {
      var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " +   DOMstrings.inputValue);

      var fieldsArr = Array.prototype.slice.call(fields); 
      fieldsArr.forEach(function(el){
        el.value = "" ;
      });  
      
      fieldsArr[0].focus();  
    },

    addListItem: function(item, type) {

      // 1. Орлого зарлагийн эл?ментийг агуулсан hTML -үүсгэнэ

      var html, list;
      if (type === 'inc') {

        list = DOMstrings.incomeList;

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">$$DESCRIPTION$$</div>  <div class="right clearfix"><div class="item__value">$$VALUE$$</div>    <div class="item__delete">                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      } else {

        list = DOMstrings.expenseList ;

        html = '<div class="item clearfix" id="expense-%id%""><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //2. Тэр HTML дотороо орлого зарлагын утгуудыг Replace ашиглан өөрчилж өгнө

      html = html.replace('%id%', item.id);
      html = html.replace('$$DESCRIPTION$$', item.description);
      html = html.replace('$$VALUE$$', item.value);

      //3. Бэлтгэсэн HTML ээ Dom руу хийж өгнө

      document.querySelector(list).insertAdjacentHTML('beforeend',html);
    }

  };
})();

// Санхүүтэй ажиллах конторллер
var financeController = (function() {
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.items[type].forEach(function(el){
      sum = sum + el.value;
    });

    data.totals[type] = sum;
  }

  var data = {
    items: {
      inc: [],
      exp: []
    },
  
    totals: {
      inc: 0,
      exp: 0
    },

    tusuv: 0,

    huvi: 0
  };
  
  return {
    tusuvTootsooloh: function(){

      // нийт орлогийн нийлбэр
      calculateTotal('inc');

      // нийт зарлагийн нийлбэр
      calculateTotal('exp');

      // төсвийн шинээр тооцооолно
      data.tusuv = data.totals.inc - data.totals.exp;

      // Орлого зарлагын хувь олно
      data.huvi = Math.round( (data.totals.exp / data.totals.inc) * 100);
    },

    tusviigAvah: function(){
      return{
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalsInc: data.totals.inc,
        totalsExp: data.totals.exp        
      }
    },

    addItem: function (type, desc, val) {
      
      var item,id;

      // id давхардахгүй байх 
      if(data.items[type].length === 0 ) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === 'inc'){
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    }
  };

})();

 // Программын холбогч конторллер
var appController = (function(uiController, financeController) {
  
  var ctrlAddItem = function() {
    // 1. оруулах өгөгдлийг дэлгэцнээс олж авах.

    var input = uiController.getInput();
 
   if (input.description !== "" && input.value !== "") {
      // 2. Олж авсан өгөгдлүүдээ санхүүгийн конторолл?рт дамжуулж тэнд хадаглах.

      var item = financeController.addItem(input.type, input.description, input.value);
      // 3. Олж авсан өгөгдлөө вэб дээр тохирох хэсэгт гаргана

      uiController.addListItem(item, input.type);
      uiController.clearFields();
      // 4. Төсөвийг тооцоолно
      financeController.tusuvTootsooloh();


      // 5. Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргах.
      var tusuv = financeController.tusviigAvah();

      // 6. Төсвийн тооцоог гаргана.
      console.log(tusuv);
   }
    
  };

  var setupEventListeners = function() {

    var DOM = uiController.getDOMstrings();   

    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      ctrlAddItem(); 
    }); 
  
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem(); 
      }
    }); 
  };

  return {
    init: function() {
      console.log('start');
      setupEventListeners();
    }
  };

})(uiController, financeController);

appController.init();