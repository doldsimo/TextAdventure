"use strict";
var textAdventure;
(function (textAdventure) {
    checkUserInput();
    function checkUserInput() {
        let inputField = document.getElementById("inputField");
        // tslint:disable-next-line: typedef
        inputField.addEventListener("keyup", function (_event) {
            if (_event.key === "Enter") {
                printOutput(inputField.value);
                inputField.value = "";
            }
        });
    }
    function printOutput(_theOutputString) {
        let divConsole = document.getElementById("console");
        divConsole.innerHTML += _theOutputString + "<br/>" + "<hr>"; // Fuegt Inhalt in den Div-Console Container ein
        divConsole.scrollTop = divConsole.scrollHeight - divConsole.clientHeight; // Nach jeder neuen Consolen Ausgabe nach unten Scrollen
    }
})(textAdventure || (textAdventure = {}));
//# sourceMappingURL=build.js.map