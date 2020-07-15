"use strict";
var textAdventure;
(function (textAdventure) {
    async function loadJsonData() {
        let content = await load("data/crossroads/allCrossroads.json");
        textAdventure.startProgram(content);
    }
    textAdventure.loadJsonData = loadJsonData;
    async function saveJsonData(_content) {
        save(JSON.stringify(_content), "data/crossroads/allCrossroads_New.json");
    }
    textAdventure.saveJsonData = saveJsonData;
    async function load(_filename) {
        // console.log("Start fetch");
        let response = await fetch(_filename);
        let text = await response.text();
        let json = JSON.parse(text);
        // alternative: json = await response.json();
        // console.log("Done fetch");
        return (json);
    }
    function save(_content, _filename) {
        let blob = new Blob([_content], { type: "text/plain" });
        let url = window.URL.createObjectURL(blob);
        //*/ using anchor element for download
        let downloader;
        downloader = document.createElement("a");
        downloader.setAttribute("href", url);
        downloader.setAttribute("download", _filename);
        document.body.appendChild(downloader);
        downloader.click();
        document.body.removeChild(downloader);
        window.URL.revokeObjectURL(url);
    }
})(textAdventure || (textAdventure = {}));
var textAdventure;
(function (textAdventure) {
    let gameSequenz = 0;
    let gameContent = [];
    textAdventure.loadJsonData();
    function startProgram(_content) {
        gameContent = _content;
        console.log(_content);
        printOutput("Zum Starten des Spieles, gebe „start“ ein.");
        getUserInput();
        // saveJsonData(_content);
    }
    textAdventure.startProgram = startProgram;
    function checkUsersChoice(_userInput) {
        // Spiel kann immer mit "q" oder "beenden" beendet werden
        if (_userInput === "q" || _userInput === "beenden") {
            printOutput("Das Spiel wurde beendet");
            gameSequenz = null;
        }
        // Spieler wird aufgefordert seinen Namen einzugeben
        if (gameSequenz === 0) {
            if (_userInput === "start") {
                printOutput("Das Spiel wird gestartet, gebe bitte deinen Namen ein.");
                gameSequenz++;
            }
        }
        // Das Spiel startet im ersten Raum  
        else if (gameSequenz === 1) {
            // Setzt Spielername in der JSON-Datei
            gameContent[0].name = _userInput;
            printOutput("Hallo " + _userInput.toUpperCase() + " das Spiel startet in:");
            let timerNumber = 3;
            let refreshIntervalId = setInterval(function () {
                if (timerNumber < 2)
                    clearInterval(refreshIntervalId);
                printOutput(timerNumber.toString());
                timerNumber--;
                // tslint:disable-next-line: align
            }, 700);
            setTimeout(function () {
                printOutput("Du befindest dich in der Bank und hast gerade den Schalter überfallen, flüchte so schnell wie möglich!");
                // tslint:disable-next-line: align
            }, 2800);
            gameSequenz++;
        }
        else if (gameSequenz === 2) {
            switch (_userInput) {
                case "start":
                    printOutput("Das Spiel wird gestartet, gebe bitte deinen Namen ein.");
                    break;
                case "b":
                    console.log("du hast b eingegeben");
                    break;
                case "c":
                    console.log("du hast c eingegeben");
                    break;
                case "d":
                    console.log("du hast d eingegeben");
                    break;
                default:
                    break;
            }
        }
    }
    function getUserInput() {
        let inputField = document.getElementById("inputField");
        inputField.addEventListener("keyup", function (_event) {
            if (_event.key === "Enter") {
                let inputValue = inputField.value.toLowerCase();
                checkUsersChoice(inputValue);
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