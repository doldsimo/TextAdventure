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
    let jsonConfigData = [];
    let currentRoom;
    textAdventure.loadJsonData();
    function startProgram(_content) {
        jsonConfigData = _content;
        printOutput("Zum Starten des Spieles, gebe „start“ ein.");
        getUserInput();
        // saveJsonData(_content);
    }
    textAdventure.startProgram = startProgram;
    function checkUsersChoice(_userInput) {
        // Spiel kann immer mit "q" oder "beenden" beendet werden
        if (_userInput === "q" || _userInput === "beenden") {
            printOutput(quitGame());
        }
        // Spieler wird aufgefordert seinen Namen einzugeben
        if (gameSequenz === 0) {
            if (_userInput === "start") {
                printOutput("Das Spiel wird gestartet, gebe bitte deinen Namen ein.");
                gameSequenz++;
            }
            else {
                printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe. Zum Starten des Spieles Start eingeben!");
            }
        }
        // Das Spiel startet im ersten Raum  
        else if (gameSequenz === 1) {
            // Setzt Spielername in der JSON-Datei
            jsonConfigData.User.name = _userInput;
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
                gameSequenz++;
                printOutput("Du befindest dich in der Bank und hast gerade den Schalter überfallen, flüchte so schnell wie möglich! <br/> [h] | hilfe ");
                // tslint:disable-next-line: align
            }, 2800);
            let bank = new textAdventure.Room(jsonConfigData.Bank.name, jsonConfigData.Bank.description, jsonConfigData.Bank.person, jsonConfigData.Bank.item, jsonConfigData.Bank.neighbour);
            currentRoom = bank;
            jsonConfigData.User.currentRoom = currentRoom;
            console.log(jsonConfigData);
        }
        else if (gameSequenz === 2) {
            switch (_userInput) {
                case "hilfe":
                case "h":
                    printOutput(outputCommands());
                    break;
                case "norden":
                case "n":
                    walkToNorth();
                    break;
                case "süden":
                case "s":
                    walkToSouth();
                    break;
                case "westen":
                case "w":
                    walkToWast();
                    break;
                case "osten":
                case "o":
                    walkToEast();
                    break;
                case "q":
                    printOutput(quitGame());
                    break;
                default:
                    break;
            }
        }
    }
    function quitGame() {
        gameSequenz = null;
        return "Spiel beendet, bis zum nächsten mal.";
    }
    function walkToEast() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[3] != null) {
            printOutput("Du läufst nach Osten");
            let roomInNorth = currentRoom.neighbour[3];
            // Durchlaufen des jsonConfigData Files
            for (let obj in jsonConfigData) {
                // Überprüfung, dass es ein Objekt der Obersten ebene ist
                if (jsonConfigData.hasOwnProperty(obj)) {
                    // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                    if (obj === roomInNorth) {
                        let theNewRoom = new textAdventure.Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                        currentRoom = theNewRoom;
                        jsonConfigData.User.currentRoom = currentRoom;
                        printOutput(currentRoom.description);
                    }
                }
            }
        }
        else {
            printOutput("Hier ist kein Raum");
        }
    }
    function walkToWast() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[2] != null) {
            printOutput("Du läufst nach Westen");
            let roomInNorth = currentRoom.neighbour[2];
            // Durchlaufen des jsonConfigData Files
            for (let obj in jsonConfigData) {
                // Überprüfung, dass es ein Objekt der Obersten ebene ist
                if (jsonConfigData.hasOwnProperty(obj)) {
                    // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                    if (obj === roomInNorth) {
                        let theNewRoom = new textAdventure.Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                        currentRoom = theNewRoom;
                        jsonConfigData.User.currentRoom = currentRoom;
                        printOutput(currentRoom.description);
                    }
                }
            }
        }
        else {
            printOutput("Hier ist kein Raum");
        }
    }
    function walkToSouth() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[1] != null) {
            printOutput("Du läufst nach Süden");
            let roomInNorth = currentRoom.neighbour[1];
            // Durchlaufen des jsonConfigData Files
            for (let obj in jsonConfigData) {
                // Überprüfung, dass es ein Objekt der Obersten ebene ist
                if (jsonConfigData.hasOwnProperty(obj)) {
                    // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                    if (obj === roomInNorth) {
                        let theNewRoom = new textAdventure.Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                        currentRoom = theNewRoom;
                        jsonConfigData.User.currentRoom = currentRoom;
                        printOutput(currentRoom.description);
                    }
                }
            }
        }
        else {
            printOutput("Hier ist kein Raum");
        }
    }
    function walkToNorth() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[0] != null) {
            printOutput("Du läufst nach Norden");
            let roomInNorth = currentRoom.neighbour[0];
            // Durchlaufen des jsonConfigData Files
            for (let obj in jsonConfigData) {
                // Überprüfung, dass es ein Objekt der Obersten ebene ist
                if (jsonConfigData.hasOwnProperty(obj)) {
                    // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                    if (obj === roomInNorth) {
                        let theNewRoom = new textAdventure.Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                        currentRoom = theNewRoom;
                        jsonConfigData.User.currentRoom = currentRoom;
                        printOutput(currentRoom.description);
                    }
                }
            }
        }
        else {
            printOutput("Hier ist kein Raum");
        }
    }
    function outputCommands() {
        let output = "[n] | norden <br/> [s] | süden <br/> [o] | osten <br/> [w] | westen <br/> [u] | umschauen <br> [i] | Inventar öffnen <br/> [a] | Item ablegen <br/>";
        if (currentRoom.person.length != 0) {
            output = output + " [r] | reden <br/>";
            // for (let i = 0; i < currentRoom.person.length; i++) {
            //     if (currentRoom.person[i].instanceof(Police)) {
            //     }
            // }
        }
        else if (currentRoom.item.length != 0) {
            output = output + "[t] | Item nehmen <br/>";
        }
        output = output + "[q] | Spiel verlassen";
        return output;
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
var textAdventure;
(function (textAdventure) {
    class Item {
        constructor(_name) {
            this.name = _name;
        }
    }
    textAdventure.Item = Item;
})(textAdventure || (textAdventure = {}));
var textAdventure;
(function (textAdventure) {
    class Person {
        constructor(_name, _text) {
            this.name = _name;
            this.text = _text;
        }
    }
    textAdventure.Person = Person;
    class Passanger extends Person {
        constructor(_name, _text, _text2) {
            super(_name, _text);
            this.text2 = _text;
        }
    }
    textAdventure.Passanger = Passanger;
    class Salesman extends Person {
        constructor(_name, _text, _text2) {
            super(_name, _text);
            this.text2 = _text;
        }
    }
    textAdventure.Salesman = Salesman;
    class Police extends Person {
        constructor(_name, _text, _life, _item) {
            super(_name, _text);
            this.life = _life;
            this.item = _item;
        }
    }
    textAdventure.Police = Police;
})(textAdventure || (textAdventure = {}));
var textAdventure;
(function (textAdventure) {
    class Room {
        constructor(_name, _description, _person, _item, _neigbour) {
            this.name = _name;
            this.description = _description;
            this.person = _person;
            this.item = this.buildingItems(_item);
            this.neighbour = _neigbour;
        }
        /* Erstellt alle Items welche sich im jeweiligen Raum befinden
        @parm:      Item Objekte
        @return:    Array von allen Items                                */
        buildingItems(_item) {
            let items = [];
            for (let i = 0; i < _item.length; i++) {
                let theItem = new textAdventure.Item(_item[i].name);
                items.push(theItem);
            }
            return items;
        }
    }
    textAdventure.Room = Room;
})(textAdventure || (textAdventure = {}));
//# sourceMappingURL=build.js.map