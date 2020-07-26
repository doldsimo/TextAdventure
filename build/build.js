"use strict";
var textAdventure;
(function (textAdventure) {
    /**
     * Funktion Lädt Json-Datei
     */
    async function loadJsonData() {
        let content = await load("data/allGameInformation.json");
        textAdventure.startProgram(content);
    }
    textAdventure.loadJsonData = loadJsonData;
    /**
     * Funktion Speichert die Json-Datei
     */
    async function saveJsonData(_content) {
        save(JSON.stringify(_content), "data/allGameInformation_New.json");
    }
    textAdventure.saveJsonData = saveJsonData;
    /**
     * Funktion lädt die JSON-Datei und gibt diese zurück
     *
     * @param _filename: String | Name der JSON-Datei, welche gealden werden soll
     * @return (json): JSONObject | Gibt die geladenen Json-Daten zurück
     */
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
    let gameSequenz = 0; // Spiel Sequenz in welcher sich der Spieler befindet
    let jsonConfigData = []; // Json Datei
    let currentRoom; // Akuteller Raum 
    let inventory = []; // Inventar 
    let health; // Lebensanzeige
    textAdventure.loadJsonData();
    let inputField = document.getElementById("inputField");
    inputField.addEventListener("keyup", function (_event) {
        if (_event.key === "Enter") {
            let inputValue = inputField.value.toLowerCase();
            checkUsersChoice(inputValue);
            inputField.value = "";
        }
    });
    /**
     * Funktion startet das Spiel
     *
     * @param _content: JSONObject | Enthält alle Daten des Spieles
     */
    function startProgram(_content) {
        jsonConfigData = _content;
        // Fuege das anfang Item zum Inventar hinzu
        inventory.push(new textAdventure.Item(jsonConfigData.User.item[0].name));
        if (gameSequenz === 0) {
            printOutput("Willkommen bei ESCAPE. <br/> Starte ein neues Spiel, gebe „start“. <br/> Laden einen Spielstand „load“.");
        }
        else {
            createNewRoom(jsonConfigData.User.currentRoom);
            health = jsonConfigData.User.health;
            gameSequenz = 2;
        }
        getUserInput();
    }
    textAdventure.startProgram = startProgram;
    /**
     * Funktion reagiert auf den User Input und ruft weitere Funktionen auf - je nach Input
     *
     * @param _userInput: String | Eingabe welche der User im Input Feld eingibt
     */
    function checkUsersChoice(_userInput) {
        // Spiel kann immer mit "q" oder "beenden" beendet werden
        if (_userInput === "q" || _userInput === "beenden") {
            printOutput(quitGame());
        }
        // Spieler wird aufgefordert seinen Namen einzugeben
        switch (gameSequenz) {
            case 0:
                switch (_userInput) {
                    case "start":
                        printOutput("Das Spiel wird gestartet, gebe bitte deinen Namen ein.");
                        gameSequenz++;
                        break;
                    case "load":
                        loadUsersJSONData();
                        break;
                    default:
                        printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                        break;
                }
                break;
            case 1:
                startGameRegulary(_userInput);
                break;
            case 2:
                switch (_userInput) {
                    case "umschauen":
                    case "u":
                        printOutput(lookAroundRoom());
                        break;
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
                    case "inventar":
                    case "i":
                        printOutput(outputInventory());
                        break;
                    case "nehmen":
                    case "t":
                        takeItem();
                        break;
                    case "ablegen":
                    case "a":
                        dropItem();
                        break;
                    case "leben":
                    case "l":
                        printOutput(showlife());
                        break;
                    case "reden":
                    case "r":
                        talkWithPerson();
                        break;
                    case "angreifen":
                    case "k":
                        attackPolice();
                        break;
                    case "verlassen":
                    case "q":
                        printOutput(quitGame());
                        break;
                    default:
                        break;
                }
                break;
            // Item Aufnehmen
            case 3:
                let userInputAsNumber = +_userInput;
                if (Number.isInteger(userInputAsNumber) && _userInput != "") {
                    pullItemFromRoomAndPushToInventory(userInputAsNumber);
                }
                else {
                    printOutput("Falsche eingabe");
                }
                break;
            // Item Ablegen
            case 4:
                let inputAsNumber = +_userInput;
                if (Number.isInteger(inputAsNumber) && _userInput != "") {
                    pullItemFromInventoryAndPushToRoom(inputAsNumber);
                }
                else {
                    printOutput("Falsche eingabe");
                }
                break;
            // Mit Person reden
            case 5:
                let inputNumber = +_userInput;
                if (Number.isInteger(inputNumber) && _userInput != "") {
                    talkWithTheRightPerson(inputNumber);
                }
                else {
                    printOutput("Falsche eingabe");
                }
                break;
            // Polizei angreifen
            case 6:
                let inNumber = +_userInput;
                if (Number.isInteger(inNumber) && _userInput != "") {
                    attackThePickedPolice(inNumber);
                }
                else {
                    printOutput("Falsche eingabe");
                }
                break;
            default:
                break;
        }
    }
    function attackThePickedPolice(_inNumber) {
        let output = "";
        // Leben abziehen
        health = health - 40;
        // Leben in der JSON-Datei Abziehen
        jsonConfigData.User.health = health;
        // Überprüfen, des aktuellen Lebens (Wenn unter 0, ist das Spiel verloren)
        if (0 >= health) {
            printOutput("Die Polizei hat im Kampf gegen dich gewonnen. Du hattest zu wenig Leben.<br/>" + gameOver());
        }
        else {
            // Durläuft alle Personen im Aktuellen Raum
            for (let i = 0; i < getAllPersons().length; i++) {
                // Schaut, ob die Person ein Polizist ist
                if (getAllPersons()[i] instanceof textAdventure.Police) {
                    // Pickt sich den Polizist, welcher sich hinter der eingegebenen Nummer verbirgt
                    if (i === _inNumber - 1) {
                        output = output + "Du hast den Polizist " + getAllPersons()[i].name + " angegriffen.<br/> Dieser ist nun bewusstlos und hat seine Gegenstände verloren.<br/>Du hast 40% Leben Verloren";
                    }
                }
            }
            // Hinzufügen der Items des Polizist zum currentRoom
            let attackedPoliceItemsArray = jsonConfigData[currentRoom.name].person.polizei[_inNumber - 1].item;
            for (let i = 0; i < attackedPoliceItemsArray.length; i++) {
                let theItem = new textAdventure.Item(attackedPoliceItemsArray[i].name);
                // Item zum Aktuellen Raum hinzufügen
                currentRoom.item.push(theItem);
                // Item in der JSON-Datei hinzufügen
                jsonConfigData[currentRoom.name].item.push(theItem);
            }
            // Entfernt den Polizisten aus der JSON-Datei
            jsonConfigData[currentRoom.name].person.polizei.splice(_inNumber - 1, _inNumber);
            // Entfernt des Polizisten aus dem aktuellen Raum
            currentRoom.police.splice(_inNumber - 1, _inNumber);
            printOutput(output);
            gameSequenz = 2;
        }
    }
    function attackPolice() {
        let output = "";
        // Überprüft, ob ein im aktuellen Raum ist
        if (currentRoom.police.length != 0) {
            output = output + "Welchen Polizisten möchtest du angreifen?";
            for (let i = 0; i < getAllPersons().length; i++) {
                if (getAllPersons()[i] instanceof textAdventure.Police) {
                    output = output + "<br/>" + "[" + [i + 1] + "]" + " Polizei | " + getAllPersons()[i].name;
                }
            }
            output = output + "<br/>Gebe die Nummer ein";
        }
        else {
            output = output + "Hier befindet sich kein Polizist.";
        }
        printOutput(output);
        gameSequenz = 6;
    }
    function talkWithTheRightPerson(_inputNumber) {
        for (let i = 0; i < getAllPersons().length; i++) {
            if (i === _inputNumber - 1) {
                if (getAllPersons()[i] instanceof textAdventure.Salesman || getAllPersons()[i] instanceof textAdventure.Passanger) {
                    if ((Math.floor(Math.random() * Math.floor(2))) === 1) {
                        printOutput(getAllPersons()[i].text);
                    }
                    else {
                        // @ts-ignore: Unreachable code error
                        printOutput(getAllPersons()[i].name + ": " + getAllPersons()[i].text2);
                    }
                }
                else {
                    printOutput(getAllPersons()[i].name + ": " + getAllPersons()[i].text);
                }
                console.log(getAllPersons()[i]);
            }
        }
        gameSequenz = 2;
    }
    function talkWithPerson() {
        let output = "";
        if (getAllPersons().length != 0) {
            output = output + "Mit wem möchtest du Reden?";
            for (let i = 0; i < getAllPersons().length; i++) {
                if (getAllPersons()[i] instanceof textAdventure.Police) {
                    output = output + "<br/>" + "[" + [i + 1] + "]" + " Polizei | " + getAllPersons()[i].name;
                }
                if (getAllPersons()[i] instanceof textAdventure.Passanger) {
                    output = output + "<br/>" + "[" + [i + 1] + "]" + " Passant | " + getAllPersons()[i].name;
                }
                if (getAllPersons()[i] instanceof textAdventure.Salesman) {
                    output = output + "<br/>" + "[" + [i + 1] + "]" + " Verkäufer | " + getAllPersons()[i].name;
                }
            }
        }
        output = output + "<br/>Gebe die Nummer ein";
        printOutput(output);
        gameSequenz = 5;
    }
    /**
     * Funktion git den Aktuellen Lebenszustand des Spielers zurück
     *
     * @return: string | Lebenszustand des Spielers
     */
    function showlife() {
        return "Dein aktueller Gesundheitszustand ist: " + health + "%";
    }
    function pullItemFromInventoryAndPushToRoom(_inputAsNumber) {
        for (let i = 0; i < inventory.length; i++) {
            if (i === _inputAsNumber - 1) {
                let item = inventory.splice(_inputAsNumber - 1, 1)[0];
                // Fügt das Item im akutellen Raum in die JSON-Datei ein
                jsonConfigData[currentRoom.name].item.push(item);
                currentRoom.item.push(item);
                printOutput(item.name + " abgelegt");
            }
        }
        gameSequenz = 2;
    }
    function dropItem() {
        let output = "";
        // Überprüfung, ob sich im Items im Inventar befinden
        if (inventory.length != 0) {
            output = output + "Folgende Gegenstände hast du im Inventar";
            for (let i = 0; i < inventory.length; i++) {
                output = output + "<br/>" + "[" + [i + 1] + "] " + inventory[i].name;
            }
            output = output + "<br/>Was möchtest du ablegen? <br/>Gebe die Nummer ein.";
            gameSequenz = 4;
        }
        else {
            output = output + "Du kannst nichts ablegen, da du keine Gegenstände im Inventar hast.";
        }
        printOutput(output);
    }
    function pullItemFromRoomAndPushToInventory(_userInputAsNumber) {
        for (let i = 0; i < currentRoom.item.length; i++) {
            if (i === _userInputAsNumber - 1) {
                // Nimmt das Item aus dem currentRoom heraus und speichert es in der Variable item
                let item = currentRoom.item.splice(_userInputAsNumber - 1, 1)[0];
                // Löscht des Item aus der JSON-Datei
                jsonConfigData[currentRoom.name].item.splice(_userInputAsNumber - 1, 1);
                let output = "";
                // Überprüft, ob das Item eine Spritze, Verband oder Hustensaft ist
                if (item.name === "Spritze") {
                    if (health + 50 < 100) {
                        health = health + 50;
                    }
                    else {
                        health = 100;
                    }
                    output = output + "<br/>Leben um 50% geheilt.";
                }
                else if (item.name === "Verband") {
                    if (health + 25 < 100) {
                        health = health + 25;
                    }
                    else {
                        health = 100;
                    }
                    output = output + "<br/>Leben um 25% geheilt.";
                }
                else if (item.name === "Hustensaft") {
                    if (health + 5 < 100) {
                        health = health + 5;
                    }
                    else {
                        health = 100;
                    }
                    output = output + "<br/>Leben um 5% geheilt.";
                }
                else {
                    // Pusth das erstellte Item ins Inventar (wennes keine Spritze, Verband oder Hustensaft ist)
                    inventory.push(item);
                }
                printOutput(item.name + " aufgenommen" + output);
            }
        }
        gameSequenz = 2;
    }
    function takeItem() {
        let output = "";
        // Überprüfung, ob sich im Raum Items befinden
        console.log(currentRoom.item.length);
        if (currentRoom.item.length != 0) {
            output = output + "Hier befinden sich folgende Gegenstände:";
            for (let i = 0; i < currentRoom.item.length; i++) {
                output = output + "<br/>" + "[" + [i + 1] + "] " + currentRoom.item[i].name;
            }
            output = output + "<br/>Was möchtest du aufnehmen? <br/>Gebe die Nummer ein.";
            gameSequenz = 3;
        }
        else {
            output = output + "Du kannst nichts aufnehmen, da sich hier kein Gegenstände befinden.";
        }
        printOutput(output);
    }
    function outputInventory() {
        let output = "In deinem Inventar befinden sich:";
        for (let i = 0; i < inventory.length; i++) {
            output = output + "<br/> - " + inventory[i].name;
        }
        return output;
    }
    function startGameRegulary(_userInput) {
        // Setzt Spielername in der JSON-Datei
        jsonConfigData.User.name = _userInput;
        gameSequenz++;
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
            let output = "Du befindest dich in der Bank und hast gerade den Schalter überfallen und dabei 20000 Euro erbeutet, flüchte so schnell wie möglich! <br/> [h] | Hilfe";
            printOutput(output);
            // tslint:disable-next-line: align
        }, 2800);
        // Setzt den Anfangsraum fest
        let bank = new textAdventure.Room(jsonConfigData.Bank.name, jsonConfigData.Bank.description, jsonConfigData.Bank.person.polizei, jsonConfigData.Bank.person.passant, jsonConfigData.Bank.person.verkaeufer, jsonConfigData.Bank.item, jsonConfigData.Bank.neighbour);
        currentRoom = bank;
        // Setzt das Anfangsleben fest
        health = jsonConfigData.User.health;
    }
    function loadUsersJSONData() {
        printOutput("<input id='loadFileButton' accept='.json' type='file'>");
        let loadFileButton = document.getElementById("loadFileButton");
        loadFileButton.addEventListener("change", function () {
            let fr = new FileReader();
            fr.onload = function () {
                // Überschreibt die jsonConfigData variable mit dem hochgeladenen Json-File
                jsonConfigData = JSON.parse(fr.result.toString());
                // Deaktiviert den Button
                loadFileButton.setAttribute("disabled", "");
                printOutput("Wilkommen zurück " + jsonConfigData.User.name);
                gameSequenz++;
                startProgram(JSON.parse(fr.result.toString()));
            };
            fr.readAsText(this.files[0]);
        });
    }
    function outputPersonsInRoom() {
        let output = "";
        if (getAllPersons().length != 0) {
            output = output + "Hier befinden sich folgende Personen:";
            for (let i = 0; i < getAllPersons().length; i++) {
                if (getAllPersons()[i] instanceof textAdventure.Police) {
                    output = output + "<br/> Polizei | " + getAllPersons()[i].name;
                }
                if (getAllPersons()[i] instanceof textAdventure.Passanger) {
                    output = output + "<br/> Passant | " + getAllPersons()[i].name;
                }
                if (getAllPersons()[i] instanceof textAdventure.Salesman) {
                    output = output + "<br/> Verkäufer | " + getAllPersons()[i].name;
                }
            }
        }
        else {
            output = output + "Hier befinden sich keine Personen";
        }
        return output;
    }
    function outputItemsInRoom() {
        let output = "";
        // Überprüfung, ob sich im Raum Items befinden
        if (currentRoom.item.length != 0) {
            output = output + "Hier befinden sich folgende Gegenstände:";
            for (let i = 0; i < currentRoom.item.length; i++) {
                output = output + "<br/> - " + currentRoom.item[i].name;
            }
        }
        else {
            output = output + "Hier befinden sich keine Gegenstände";
        }
        return output;
    }
    /**
     * Funktion gibt den Beschreibungstext des aktuellen Raumes zurück
     *
     * @return: String | Beschreibungstext des Raumes
     */
    function lookAroundRoom() {
        return outputItemsInRoom() + "<br/>" + outputPersonsInRoom();
    }
    /**
     * Funktion beendet das Spiel
     */
    function quitGame() {
        gameSequenz = null;
        return "Spiel beendet, bis zum nächsten mal.";
    }
    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Osten ein Raum existiert
     */
    function walkToEast() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[3] != null) {
            printOutput("Du läufst nach Osten");
            let roomInEast = currentRoom.neighbour[3];
            createNewRoom(roomInEast);
        }
        else {
            printOutput("Nach Osten befindet sich kein Weg.");
        }
    }
    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Westen ein Raum existiert
     */
    function walkToWast() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[2] != null) {
            printOutput("Du läufst nach Westen");
            let roomInWest = currentRoom.neighbour[2];
            createNewRoom(roomInWest);
        }
        else {
            printOutput("Nach Westen befindet sich kein Weg.");
        }
    }
    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Süden ein Raum existiert
     */
    function walkToSouth() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[1] != null && currentRoom.neighbour[1] != "Baustelle") {
            printOutput("Du läufst nach Süden");
            let roomInSouth = currentRoom.neighbour[1];
            createNewRoom(roomInSouth);
        }
        else if (currentRoom.neighbour[1] === "Baustelle") {
            printOutput("Hier befindet sich eine Baustelle, dieser Weg ist versperrt.");
        }
        else {
            printOutput("Nach Süden befindet sich kein Weg.");
        }
    }
    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Norden ein Raum existiert
     */
    function walkToNorth() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[0] != null && currentRoom.neighbour[0] != "Baustelle" && currentRoom.neighbour[0] != "Garage") {
            printOutput("Du läufst nach Norden");
            let roomInNorth = currentRoom.neighbour[0];
            createNewRoom(roomInNorth);
        }
        else if (currentRoom.neighbour[0] === "Baustelle") {
            printOutput("Hier befindet sich eine Baustelle, dieser Weg ist versperrt.");
        }
        else if (currentRoom.neighbour[0] === "Garage") {
            // Überprüft, ob der Garagenschlüssel im Inventar ist
            let nokey = true;
            for (let i = 0; i < inventory.length; i++) {
                if (inventory[i].name === "Garagenschlüssel") {
                    printOutput("Garage mit Garagenschlüssel geöffnet");
                    // let roomInNorth: string = currentRoom.neighbour[0];
                    // createNewRoom(roomInNorth);
                    nokey = false;
                    printOutput(gameWin());
                }
            }
            if (nokey) {
                printOutput("Um in die Garage zu gelangen, brauchst du den Garagenschlüssel in deinem Inventar.");
            }
        }
        else {
            printOutput("Nach Norden befindet sich kein Weg.");
        }
    }
    /**
     * Funktion erzeugt ein neues Raum-Objekt, welche anschließend in der "currentRoom" variable gespeichert wird
     *
     * @param _nameOfNewRoom: String | Name des Raumes in welchen man navigieren möchte
     */
    function createNewRoom(_nameOfNewRoom) {
        // Durchlaufen des jsonConfigData Files
        for (let obj in jsonConfigData) {
            // Überprüfung, dass es ein Objekt der Obersten ebene ist
            if (jsonConfigData.hasOwnProperty(obj)) {
                // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                if (obj === _nameOfNewRoom) {
                    let theNewRoom = new textAdventure.Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person.polizei, jsonConfigData[obj].person.passant, jsonConfigData[obj].person.verkaeufer, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                    currentRoom = theNewRoom;
                    jsonConfigData.User.currentRoom = currentRoom;
                    // let output: string = currentRoom.description + "<br/>" + outputItemsInRoom();
                    printOutput(currentRoom.description + "<br/> [h] | Hilfe");
                }
            }
        }
    }
    /**
     * Funktion gibt Commandos zurück welcher der User im jeweiligen Raum hat
     *
     * @return output: String
     */
    function outputCommands() {
        let output = "[n] | Norden <br/> [s] | Süden <br/> [o] | Osten <br/> [w] | Westen <br/>[u] | umschauen <br> [l] | Gesundheitszustand anzeigen <br/> [i] | Inventar öffnen <br/> ";
        if (getAllPersons().length != 0) {
            output = output + " [r] | reden <br/>";
        }
        if (currentRoom.item.length != 0) {
            output = output + "[t] | Item nehmen <br/>";
        }
        if (inventory.length > 0) {
            output = output + "[a] | Item ablegen <br/>";
        }
        let firstTime = true;
        for (let i = 0; i < getAllPersons().length; i++) {
            if (getAllPersons()[i] instanceof textAdventure.Police && firstTime) {
                output = output + "[k] | Polizei angreifen <br/>";
                firstTime = false;
            }
        }
        output = output + "-------------------------- <br/>[q] | Spiel verlassen";
        return output;
    }
    /**
     * Funktion fasst alle Polizisten, Passanten und Verkäufer im Akutellen Raum
     * in ein Personen Array zusammen und gibt dieses zurück
     *
     * @retrun allPersons: Person[] | Enthält alle Personen
     */
    function getAllPersons() {
        let allPersons = [];
        for (let i = 0; i < currentRoom.police.length; i++) {
            allPersons.push(currentRoom.police[i]);
        }
        for (let i = 0; i < currentRoom.passanger.length; i++) {
            allPersons.push(currentRoom.passanger[i]);
        }
        for (let i = 0; i < currentRoom.salesman.length; i++) {
            allPersons.push(currentRoom.salesman[i]);
        }
        return allPersons;
    }
    function gameOver() {
        gameSequenz = null;
        return "Das Spiel ist vorbei";
    }
    function gameWin() {
        gameSequenz = null;
        return "Herzlichen Glückwunsch du wurdest nicht von der Polizei geschnappt und hast gewonnen!";
    }
    /**
     * Funktion löst Event aus, sobald der User etwas ins Input Feld eingegeben hat und mit Enter bestätigt hat
     */
    function getUserInput() {
    }
    /**
     * Funktion fuegt den übergebenen String dem HTML-Dokument hinzu
     *
     * @param _theOutputString: String | String welcher ausgegeben werden soll
     */
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
    class Police extends Person {
        constructor(_name, _text, _life, _item) {
            super(_name, _text);
            this.life = _life;
            this.item = _item;
        }
    }
    textAdventure.Police = Police;
    class Passanger extends Person {
        constructor(_name, _text, _text2) {
            super(_name, _text);
            this.text2 = _text2;
        }
    }
    textAdventure.Passanger = Passanger;
    class Salesman extends Person {
        constructor(_name, _text, _text2) {
            super(_name, _text);
            this.text2 = _text2;
        }
    }
    textAdventure.Salesman = Salesman;
})(textAdventure || (textAdventure = {}));
var textAdventure;
(function (textAdventure) {
    class Room {
        constructor(_name, _description, _police, _passanger, _salesman, _item, _neigbour) {
            this.name = _name;
            this.description = _description;
            this.police = this.createPolice(_police);
            this.passanger = this.createPassanger(_passanger);
            this.salesman = this.createSalesman(_salesman);
            this.item = this.buildingItems(_item);
            this.neighbour = _neigbour;
            // this.person = this.addAllPersons();
        }
        createPolice(_police) {
            let allPolice = [];
            for (let i = 0; i < _police.length; i++) {
                let thePliceman = new textAdventure.Police(_police[i].name, _police[i].text, _police[i].life, _police[i].item);
                allPolice.push(thePliceman);
            }
            return allPolice;
        }
        createPassanger(_passanger) {
            let allPassanger = [];
            for (let i = 0; i < _passanger.length; i++) {
                let thePassanger = new textAdventure.Passanger(_passanger[i].name, _passanger[i].text, _passanger[i].text2);
                allPassanger.push(thePassanger);
            }
            return allPassanger;
        }
        createSalesman(_salesman) {
            let allSalesman = [];
            for (let i = 0; i < _salesman.length; i++) {
                let theSalesman = new textAdventure.Salesman(_salesman[i].name, _salesman[i].text, _salesman[i].text2);
                allSalesman.push(theSalesman);
            }
            return allSalesman;
        }
        /**
         * Erstellt alle Items welche sich im jeweiligen Raum befinden
         *
         * @param _item | Item Objekt
         * @return items | Array mit allen Items
         */
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