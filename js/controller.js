// obiekt controller
controller = {
  self: this,
  init: function () {
    console.log("controller");

    // 'this' czyli chodzi o funkcję wewnątrz 'controller'
    this.generateButtons();
    view.Render();
    window.addEventListener("keydown", (e) => {
      if (e.key !== "F12") {
        e.preventDefault();
        this.keyListener(e);
      }
    });
  },

  onClickEvent: function (button, eKey = "") {
    // console.log("onClickEvent Fn");

    // check if the previously clicked btn is a calculating operator and if so prevent user from clicked now any calculating operator again or an equal command
    let checkIfCurrentBtnIsCalc, checkIfPrevBtnIsCalc;
    if (button.value != "=") {
      const operatorsBtnList = this.getOperatorButtons();
      checkIfCurrentBtnIsCalc = operatorsBtnList.some((btn) => {
        return btn.value == button.value;
      });
      model.ifItIsBtnCalculating = checkIfCurrentBtnIsCalc;

      checkIfPrevBtnIsCalc = operatorsBtnList.some((btn) => {
        return btn.value == model.btnClicked.value;
      });

      if (checkIfCurrentBtnIsCalc && checkIfPrevBtnIsCalc) {
        view.RenderAlert("You cannot use calculating operators one by one!");
      } else {
        model.btnClicked = button;

        if (
          button.value !== "del" &&
          button.value !== "C" &&
          button.value !== "%"
        ) {
          document.getElementById("output").value += button.value;
        } else if (button.value === "%") {
          const resultper = document.getElementById("output").value;
          controller.evaluate(resultper, "%");
          model.ifItIsBtnCalculating = false;
          model.btnClicked = model.buttons[0];
        } else if (button.value === "C") {
          view.RenderClear(document.getElementById("output"));
        } else if (button.value === "del") {
          view.RenderBack(document.getElementById("output").value);
        }
      }
    } else if (button.value === "=" || eKey === "Enter") {
      if (model.ifItIsBtnCalculating) {
        // alert("You have to complete the calculating statement with a number!");
        view.RenderAlert(
          "You have to complete the calculating statement with a number!"
        );
      } else {
        controller.evaluate(document.getElementById("output").value);
      }
    }
  },

  keyListener: function (e) {
    let button = "";
    // check if the clicked key btn is supported by the calculator
    const ifBtnSuits = model.buttons.some((sign) => {
      if (sign.value == e.key) button = sign;
      return sign.value == e.key;
    });
    if (ifBtnSuits === true) {
      this.onClickEvent(button, e.key);
    } else {
      //   console.log("ELSE");
      if (e.key === "=" || e.key === "Enter") {
        const findBtn = model.buttons.find(
          (sign) => sign.getAttribute("data-btn") === "equal"
        );
        this.onClickEvent(findBtn, e.key);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        const findBtn = model.buttons.find(
          (sign) => sign.getAttribute("data-btn") === "backspace"
        );
        this.onClickEvent(findBtn, e.key);
      } else if (e.key === "%") {
        const findBtn = model.buttons.find(
          (sign) => sign.getAttribute("data-btn") === "percent"
        );
        this.onClickEvent(findBtn, e.key);
      } else if (e.key === "Escape") {
        const findBtn = model.buttons.find(
          (sign) => sign.getAttribute("data-btn") === "clear"
        );
        this.onClickEvent(findBtn, e.key);
      }
    }
  },

  createButton: function (text, val, dataVal, type, extraClass = null) {
    var button = document.createElement("button");
    // value poniżej to będzie +,-,*,/, =, %, .
    button.setAttribute("value", val);
    button.setAttribute("data-btn", dataVal);
    button.textContent = text;
    button.className = "btn";

    // the "button" below is to differentiate our operators from numbers for positiong
    // dodajemy klasę "operator" lub / i "calculation" do elementu "button"
    if (type === "operator") button.className += " operator";
    if (extraClass === "calculation") button.className += " calculation";

    button.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      this.onClickEvent(button);
    });
    return button;
  },

  generateButtons: function () {
    console.log("Generating buttons");

    // let's create buttons with numbers 1,2,3,4...
    for (var i = 1; i < 10; i++) {
      button = this.createButton(i, i, i);
      // make sure we push buttons to our model so we can render them later
      model.buttons.push(button);
      if (i === 9) {
        i = 0;
        button = this.createButton(i, i, i);
        model.buttons.push(button);
        break;
      }
    }

    button = this.createButton("C", "C", "clear", "operator");

    model.buttons.push(button);
    button = this.createButton("Del", "del", "backspace", "operator");
    model.buttons.push(button);

    button = this.createButton("+", "+", "add", "operator", "calculation");
    // ponieważ zmienna 'button' przyjmuje tutaj różne wartości to aby nie utracić tych wartości
    // zapisujemy je do tablicy "buttons" w obiekcie "model"
    model.buttons.push(button);
    button = this.createButton(
      "-",
      "-",
      "substract",
      "operator",
      "calculation"
    );
    model.buttons.push(button);
    button = this.createButton("*", "*", "multiply", "operator", "calculation");
    model.buttons.push(button);
    button = this.createButton("/", "/", "divide", "operator", "calculation");
    model.buttons.push(button);
    button = this.createButton("%", "%", "percent", "operator", "calculation");
    model.buttons.push(button);
    button = this.createButton(".", ".", "dot", "operator", "calculation");
    model.buttons.push(button);

    button = this.createButton("=", "=", "equal", "operator");
    button.id = "evaluate";

    model.buttons.push(button);
  },

  getButtons: function () {
    return model.buttons;
  },

  getOperatorButtons: function () {
    const operatorBtns = model.buttons.filter((el) =>
      el.classList.contains("calculation")
    );
    return operatorBtns;
  },

  evaluate: function (str, sign) {
    if (sign === "%") {
      const indMult = str.indexOf("*");
      if (indMult === -1) {
        view.RenderAlert(
          'While estimating per cent please use a multiply sign "*" between the the number and percent value e.g. 50 * 20%'
        );
      } else {
        let numberVal = str.substr(0, indMult);
        let percentVal = str.substr(indMult + 1);
        percentVal = eval(percentVal / 100);
        str = eval(numberVal) * percentVal;
        view.RenderAnswer(str);
      }
    } else {
      view.RenderAnswer(eval(str));
    }
  },
};

controller.init();
