
// дэлгэцтэй ажиллах конторллер
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: '.income__list',
    expenseList: '.expenses__list',
    tusuvLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    containerDiv: '.container'
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

    tusviigUzuuleh: function(tusuv){
      document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
      document.querySelector(DOMstrings.incomeLabel).textContent = tusuv.totalsInc;
      document.querySelector(DOMstrings.expenseLabel).textContent = tusuv.totalsExp;

      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
      }
    },

    deleteListItem: function(id){
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    addListItem: function(item, type) {

      // 1. Орлого зарлагийн эл?ментийг агуулсан hTML -үүсгэнэ

      var html, list;
      if (type === 'inc') {

        list = DOMstrings.incomeList;

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div>  <div class="right clearfix"><div class="item__value">$$VALUE$$</div>    <div class="item__delete">                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      } else {

        list = DOMstrings.expenseList ;

        html = '<div class="item clearfix" id="exp-%id%""><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

    deleteItems: function(type, id){
      var ids = data.items[type].map(function(el){
        return el.id;});

        var index = ids.indexOf(id);

        if (index !== -1) {
          data.items[type].splice(index, 1);
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
      
      // Төсвийг шинээр тооцоолж дэлгэцэнд хэвлэх
      updateTusuv();
   }
    
  };

  var updateTusuv = function() {
    // 4. Төсөвийг тооцоолно
    financeController.tusuvTootsooloh();

    // 5. Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргах.
    var tusuv = financeController.tusviigAvah();

    // 6. Төсвийн тооцоог гаргана.
    uiController.tusviigUzuuleh(tusuv);
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

    document.querySelector(DOM.containerDiv).addEventListener('click', function(event){
      
      //console.log(event.target.parentNode.parentNode.parentNode.parentNode.id); // эцэг элмент --- parentNode
      var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

      // id байгаа үгүйг шалгах
      if (id) {
        // id гаас тоог салгаж авна
      var arr = id.split('-');

      var type = arr[0];
      var itemId = parseInt(arr[1]);

      // 1. Санхүүгийн модулиас type, id ашиглан устгана
      financeController.deleteItems(type, itemId);

      // 2, дэлгэц дээрээс энэ элментийг утгана
        uiController.deleteListItem(id);

      // 3, Үлдэгдэл тооцоог шинэчилж харуулна
      
      // Төсвийг шинээр тооцоолж дэлгэцэнд хэвлэх
      updateTusuv();
      }            
    });
  };

  return {
    init: function() {
      console.log('start');
      uiController.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalsInc: 0,
        totalsExp: 0
      });
      setupEventListeners();
    }
  };

})(uiController, financeController);

appController.init();