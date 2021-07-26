// obiekt view
view = {
  Render: function () {
    console.log("Rendering...");

    // odwołujemy się do "getButtons" w "controller", a nie bezpośrednio do "Model"
    buttonsList = controller.getButtons();
    // console.log(buttonsList);
    // let's iterate over our buttons table and add each of them to the DOM
    for (var i = 0; i < buttonsList.length; i++) {
      if (
        buttonsList[i].className == "btn operator" ||
        buttonsList[i].className == "btn operator calculation"
      ) {
        document.getElementById("operators").append(buttonsList[i]);
      } else {
        document.getElementById("button-grid").append(buttonsList[i]);
      }
    }
  },

  RenderAnswer: function (str) {
    document.getElementById("output").value = "";
    document.getElementById("output").value = str;
  },

  RenderClear: function (outp) {
    outp.value = "";
  },

  RenderBack: function (output) {
    let delVal = output.substr(0, output.length - 1);
    document.getElementById("output").value = delVal;
  },
  RenderAlert: function (msg) {
    alert(msg);
  },
};
