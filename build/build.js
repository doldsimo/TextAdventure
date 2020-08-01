"use strict";
var textAdventure;
(function (textAdventure) {
    function attackPolice() {
        let output = "";
        // Überprüft, ob ein im aktuellen Raum ist
        if (textAdventure.currentRoom.police.length != 0) {
            output = output + "Welchen Polizisten möchtest du angreifen?";
            for (let i = 0; i < textAdventure.getAllPersonsFromCurrentRoom().length; i++) {
                if (textAdventure.getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Police) {
                    output = output + "<br/>" + "<b>[" + [i + 1] + "]</b>" + " Polizei | " + textAdventure.getAllPersonsFromCurrentRoom()[i].name;
                }
            }
            textAdventure.gameSequenz = 6;
            output = output + "<br/>Gebe die Nummer ein.";
        }
        else {
            output = output + "Hier befindet sich kein Polizist.";
            textAdventure.gameSequenz = 2;
        }
        textAdventure.printOutput(output);
    }
    textAdventure.attackPolice = attackPolice;
    function attackThePickedPolice(_inNumber) {
        let output = "";
        // Leben abziehen
        textAdventure.health = textAdventure.health - 40;
        // Leben in der JSON-Datei Abziehen
        textAdventure.jsonConfigData.User.health = textAdventure.health;
        // Überprüfen, des aktuellen Lebens (Wenn unter 0, ist das Spiel verloren)
        if (0 >= textAdventure.health) {
            textAdventure.printOutput(textAdventure.gameOver("<div class='game-Over'><b>Die Polizei hat im Kampf gegen dich gewonnen. Du hattest zu wenig Leben.<br/>Das Spiel ist vorbei.</b></div>"));
        }
        else {
            // Durläuft alle Personen im Aktuellen Raum
            for (let i = 0; i < textAdventure.getAllPersonsFromCurrentRoom().length; i++) {
                // Schaut, ob die Person ein Polizist ist
                if (textAdventure.getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Police) {
                    // Pickt sich den Polizist, welcher sich hinter der eingegebenen Nummer verbirgt
                    if (i === _inNumber - 1) {
                        output = output + "Du hast den Polizist " + textAdventure.getAllPersonsFromCurrentRoom()[i].name + " angegriffen.<br/> Dieser ist nun bewusstlos und hat seine Gegenstände verloren.<br/>Du hast 40% Leben verloren. Dein Gesundheitszustand beträgt nun " + textAdventure.health + "%.";
                    }
                }
            }
            // Hinzufügen der Items des Polizist zum currentRoom
            let attackedPoliceItemsArray = textAdventure.jsonConfigData.Rooms[textAdventure.getIndexOfCurrentRoom(textAdventure.currentRoom)].person.police[_inNumber - 1].item;
            for (let i = 0; i < attackedPoliceItemsArray.length; i++) {
                let theItem = new textAdventure.Item(attackedPoliceItemsArray[i].name);
                // Item zum Aktuellen Raum hinzufügen
                textAdventure.currentRoom.item.push(theItem);
                // Item in der JSON-Datei hinzufügen
                textAdventure.jsonConfigData.Rooms[textAdventure.getIndexOfCurrentRoom(textAdventure.currentRoom)].item.push(theItem);
            }
            // Entfernt den Polizisten aus der JSON-Datei
            textAdventure.jsonConfigData.Rooms[textAdventure.getIndexOfCurrentRoom(textAdventure.currentRoom)].person.police.splice(_inNumber - 1, _inNumber);
            // Entfernt des Polizisten aus dem aktuellen Raum
            textAdventure.currentRoom.police.splice(_inNumber - 1, _inNumber);
            textAdventure.printOutput(output);
            textAdventure.gameSequenz = 2;
        }
    }
    textAdventure.attackThePickedPolice = attackThePickedPolice;
    function talkWithTheRightPerson(_inputNumber) {
        for (let i = 0; i < textAdventure.getAllPersonsFromCurrentRoom().length; i++) {
            if (i === _inputNumber - 1) {
                if (textAdventure.getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Police) {
                    textAdventure.printOutput(getAllPolicemanFromCurrentRoom()[i].name + ": " + "<i>„" + getAllPolicemanFromCurrentRoom()[i].text + "“</i>");
                }
                if (textAdventure.getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Passanger) {
                    if ((Math.floor(Math.random() * Math.floor(2))) === 1) {
                        textAdventure.printOutput(getAllPassangerFromCurrentRoom()[i - getAllPolicemanFromCurrentRoom().length].name + ": " + "<i>„" + getAllPassangerFromCurrentRoom()[i - getAllPolicemanFromCurrentRoom().length].text + "“</i>");
                    }
                    else {
                        textAdventure.printOutput(getAllPassangerFromCurrentRoom()[i - getAllPolicemanFromCurrentRoom().length].name + ": " + "<i>„" + getAllPassangerFromCurrentRoom()[i - getAllPolicemanFromCurrentRoom().length].text2 + "“</i>");
                    }
                }
                if (textAdventure.getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Salesman) {
                    if ((Math.floor(Math.random() * Math.floor(2))) === 1) {
                        textAdventure.printOutput(getAllSalesmanFromCurrentRoom()[i - (getAllPolicemanFromCurrentRoom().length + getAllPassangerFromCurrentRoom().length)].name + ": " + "<i>„" + getAllSalesmanFromCurrentRoom()[i - (getAllPolicemanFromCurrentRoom().length + getAllPassangerFromCurrentRoom().length)].text + "“</i>");
                    }
                    else {
                        textAdventure.printOutput(getAllSalesmanFromCurrentRoom()[i - (getAllPolicemanFromCurrentRoom().length + getAllPassangerFromCurrentRoom().length)].name + ": " + "<i>„" + getAllSalesmanFromCurrentRoom()[i - (getAllPolicemanFromCurrentRoom().length + getAllPassangerFromCurrentRoom().length)].text2 + "“</i>");
                    }
                }
            }
        }
        textAdventure.gameSequenz = 2;
    }
    textAdventure.talkWithTheRightPerson = talkWithTheRightPerson;
    function talkWithPerson() {
        let output = "";
        if (textAdventure.getAllPersonsFromCurrentRoom().length != 0) {
            output = output + "Mit wem möchtest du Reden?";
            for (let i = 0; i < textAdventure.getAllPersonsFromCurrentRoom().length; i++) {
                if (textAdventure.getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Police) {
                    output = output + "<br/>" + "<b>[" + [i + 1] + "]</b>" + " Polizei | " + textAdventure.getAllPersonsFromCurrentRoom()[i].name;
                }
                if (textAdventure.getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Passanger) {
                    output = output + "<br/>" + "<b>[" + [i + 1] + "]</b>" + " Passant | " + textAdventure.getAllPersonsFromCurrentRoom()[i].name;
                }
                if (textAdventure.getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Salesman) {
                    output = output + "<br/>" + "<b>[" + [i + 1] + "]</b>" + " Verkäufer | " + textAdventure.getAllPersonsFromCurrentRoom()[i].name;
                }
            }
        }
        output = output + "<br/>Gebe die Nummer ein.";
        textAdventure.printOutput(output);
        textAdventure.gameSequenz = 5;
    }
    textAdventure.talkWithPerson = talkWithPerson;
    function getAllPolicemanFromCurrentRoom() {
        let allPoliceman = [];
        for (let i = 0; i < textAdventure.currentRoom.police.length; i++) {
            allPoliceman.push(textAdventure.currentRoom.police[i]);
        }
        return allPoliceman;
    }
    function getAllPassangerFromCurrentRoom() {
        let allPassanger = [];
        for (let i = 0; i < textAdventure.currentRoom.passanger.length; i++) {
            allPassanger.push(textAdventure.currentRoom.passanger[i]);
        }
        return allPassanger;
    }
    function getAllSalesmanFromCurrentRoom() {
        let allSalesman = [];
        for (let i = 0; i < textAdventure.currentRoom.salesman.length; i++) {
            allSalesman.push(textAdventure.currentRoom.salesman[i]);
        }
        return allSalesman;
    }
})(textAdventure || (textAdventure = {}));
var textAdventure;
(function (textAdventure) {
    /**
     * Funktion Lädt Json-Datei
     */
    async function startloadJsonData() {
        let content = await load("data/allGameInformation.json");
        textAdventure.startProgram(content);
    }
    textAdventure.startloadJsonData = startloadJsonData;
    /**
     * Funktion lädt die JSON-Datei und gibt diese zurück
     *
     * @param _filename: String | Name der JSON-Datei, welche gealden werden soll
     * @return (json): JSONObject | Gibt die geladenen Json-Daten zurück
     */
    async function load(_filename) {
        let response = await fetch(_filename);
        let text = await response.text();
        let json = JSON.parse(text);
        return (json);
    }
    function loadUsersJSONData() {
        textAdventure.printOutput("<input id='loadFileButton' accept='.json' type='file'>");
        let loadFileButton = document.getElementById("loadFileButton");
        loadFileButton.addEventListener("change", function () {
            let fr = new FileReader();
            fr.onload = function () {
                // Überschreibt die jsonConfigData variable mit dem hochgeladenen Json-File
                textAdventure.jsonConfigData = JSON.parse(fr.result.toString());
                // Deaktiviert den Button
                loadFileButton.setAttribute("disabled", "");
                textAdventure.printOutput("Wilkommen zurück " + (textAdventure.jsonConfigData.User.name).toUpperCase() + ".");
                textAdventure.gameSequenz++;
                console.log(textAdventure.jsonConfigData);
                textAdventure.startProgram(textAdventure.jsonConfigData);
            };
            fr.readAsText(this.files[0]);
        });
    }
    textAdventure.loadUsersJSONData = loadUsersJSONData;
    function saveGame() {
        //Aktuelles Inventar wird in die JSON-Datei geschrieben
        textAdventure.jsonConfigData.User.item = textAdventure.inventory;
        //Current Room wird festgelegt
        textAdventure.jsonConfigData.User.currentRoom = textAdventure.currentRoom.name;
        //Aktueller Lebensstand wird in die JSON-Datei geschrieben
        textAdventure.jsonConfigData.User.health = textAdventure.health;
        textAdventure.printOutput("<div class='game-Over'><b>Das Spiel wurde gespeichert. Schaue in deinen Downloads.<br/>Zum Weiterspielen starte das Spiel und lade die Datei.</b></div>");
        save(textAdventure.jsonConfigData, "gameData");
    }
    textAdventure.saveGame = saveGame;
    function save(_content, _filename) {
        //JSON-Objekt in Text umwandeln
        let myJson = JSON.stringify(_content);
        let blob = new Blob([myJson], { type: "application/json" });
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
    textAdventure.save = save;
})(textAdventure || (textAdventure = {}));
var textAdventure;
(function (textAdventure) {
    textAdventure.gameSequenz = 0; // Spiel Sequenz in welcher sich der Spieler befindet
    let money; // Akutelles Geld
    textAdventure.inventory = []; // Inventar 
    textAdventure.startloadJsonData();
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
        textAdventure.jsonConfigData = _content;
        // Fuege das anfang Item zum Inventar hinzu
        // inventory.push(new Item(jsonConfigData.User.item[0].name));
        if (textAdventure.gameSequenz === 0) {
            printOutput("Willkommen bei ESCAPE. <br/> Starte ein neues Spiel, gebe „start“. <br/> Laden einen Spielstand „load“.");
            //Fuege das Geld der JSON Datei in die Money Variable und ins Inventar ein
            money = new textAdventure.Item(textAdventure.jsonConfigData.User.item[0].name);
            textAdventure.inventory.push(money);
        }
        else {
            // Erstellen des gespeicherten Raums
            createNewRoom(textAdventure.jsonConfigData.User.currentRoom);
            // Setzen des gespeicherten Lebens
            textAdventure.health = textAdventure.jsonConfigData.User.health;
            // Setzen des Inventars
            textAdventure.inventory = textAdventure.jsonConfigData.User.item;
            textAdventure.gameSequenz = 2;
        }
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
        switch (textAdventure.gameSequenz) {
            case 0:
                switch (_userInput) {
                    case "start":
                        printOutput("Das Spiel wird gestartet, gebe bitte deinen Namen ein.");
                        textAdventure.gameSequenz++;
                        break;
                    case "load":
                        textAdventure.loadUsersJSONData();
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
                        textAdventure.walkToNorth();
                        break;
                    case "süden":
                    case "s":
                        textAdventure.walkToSouth();
                        break;
                    case "westen":
                    case "w":
                        textAdventure.walkToWast();
                        break;
                    case "osten":
                    case "o":
                        textAdventure.walkToEast();
                        break;
                    case "inventar":
                    case "i":
                        printOutput(textAdventure.outputInventory());
                        break;
                    case "nehmen":
                    case "t":
                        textAdventure.takeItem();
                        break;
                    case "ablegen":
                    case "a":
                        textAdventure.dropItem();
                        break;
                    case "leben":
                    case "l":
                        printOutput(showlife());
                        break;
                    case "reden":
                    case "r":
                        textAdventure.talkWithPerson();
                        break;
                    case "angreifen":
                    case "k":
                        textAdventure.attackPolice();
                        break;
                    case "speichern":
                    case "f":
                        textAdventure.saveGame();
                        break;
                    case "verlassen":
                    case "q":
                        printOutput(quitGame());
                        break;
                    default:
                        printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                        break;
                }
                break;
            // Item Aufnehmen
            case 3:
                let userInputAsNumber = +_userInput;
                if (Number.isInteger(userInputAsNumber) && _userInput != "") {
                    textAdventure.pullItemFromRoomAndPushToInventory(userInputAsNumber);
                }
                else {
                    printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                }
                break;
            // Item Ablegen
            case 4:
                let inputAsNumber = +_userInput;
                if (Number.isInteger(inputAsNumber) && _userInput != "") {
                    textAdventure.pullItemFromInventoryAndPushToRoom(inputAsNumber);
                }
                else {
                    printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                }
                break;
            // Mit Person reden
            case 5:
                let inputNumber = +_userInput;
                if (Number.isInteger(inputNumber) && _userInput != "") {
                    textAdventure.talkWithTheRightPerson(inputNumber);
                }
                else {
                    printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                }
                break;
            // Polizei angreifen
            case 6:
                let inNumber = +_userInput;
                if (Number.isInteger(inNumber) && _userInput != "") {
                    textAdventure.attackThePickedPolice(inNumber);
                }
                else {
                    printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                }
                break;
            default:
                break;
        }
    }
    function getIndexOfCurrentRoom(_currentRom) {
        let index;
        for (let i = 0; i < textAdventure.jsonConfigData.Rooms.length; i++) {
            if (_currentRom.name === textAdventure.jsonConfigData.Rooms[i].name) {
                index = i;
            }
        }
        return index;
    }
    textAdventure.getIndexOfCurrentRoom = getIndexOfCurrentRoom;
    function startGameRegulary(_userInput) {
        // Setzt Spielername in der JSON-Datei
        textAdventure.jsonConfigData.User.name = _userInput;
        textAdventure.gameSequenz++;
        printOutput("Hallo " + _userInput.toUpperCase() + ", das Spiel startet in:");
        let timerNumber = 3;
        let refreshIntervalId = setInterval(function () {
            if (timerNumber < 2)
                clearInterval(refreshIntervalId);
            printOutput("<p class='red'>" + timerNumber.toString() + "<p/>");
            timerNumber--;
            // tslint:disable-next-line: align
        }, 700);
        setTimeout(function () {
            let output = "<b class='blue'>Du befindest dich in der Bank und hast gerade den Schalter überfallen und dabei 20000 Euro erbeutet. Flüchte so schnell wie möglich!</b> <br/> <b>[h]</b> | Hilfe";
            printOutput(output);
            // tslint:disable-next-line: align
        }, 2800);
        // Setzt den Anfangsraum fest
        let bank = new textAdventure.Room(textAdventure.jsonConfigData.Rooms[0].name, textAdventure.jsonConfigData.Rooms[0].description, textAdventure.jsonConfigData.Rooms[0].person.police, textAdventure.jsonConfigData.Rooms[0].person.passanger, textAdventure.jsonConfigData.Rooms[0].person.salesman, textAdventure.jsonConfigData.Rooms[0].item, textAdventure.jsonConfigData.Rooms[0].neighbour);
        textAdventure.currentRoom = bank;
        // Setzt das Anfangsleben fest
        textAdventure.health = textAdventure.jsonConfigData.User.health;
    }
    function outputPersonsInRoom() {
        let output = "";
        if (getAllPersonsFromCurrentRoom().length != 0) {
            output = output + "Hier befinden sich folgende Personen:";
            for (let i = 0; i < getAllPersonsFromCurrentRoom().length; i++) {
                if (getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Police) {
                    output = output + "<br/> Polizei | " + getAllPersonsFromCurrentRoom()[i].name;
                }
                if (getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Passanger) {
                    output = output + "<br/> Passant | " + getAllPersonsFromCurrentRoom()[i].name;
                }
                if (getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Salesman) {
                    output = output + "<br/> Verkäufer | " + getAllPersonsFromCurrentRoom()[i].name;
                }
            }
        }
        else {
            output = output + "Hier befinden sich keine Personen.";
        }
        return output;
    }
    function outputItemsInRoom() {
        let output = "";
        // Überprüfung, ob sich im Raum Items befinden
        if (textAdventure.currentRoom.item.length != 0) {
            output = output + "Hier befinden sich folgende Gegenstände:";
            for (let i = 0; i < textAdventure.currentRoom.item.length; i++) {
                output = output + "<br/> - " + textAdventure.currentRoom.item[i].name;
            }
        }
        else {
            output = output + "Hier befinden sich keine Gegenstände.";
        }
        return output;
    }
    /**
     * Funktion erzeugt ein neues Raum-Objekt, welche anschließend in der "currentRoom" variable gespeichert wird
     *
     * @param _nameOfNewRoom: String | Name des Raumes in welchen man navigieren möchte
     */
    function createNewRoom(_nameOfNewRoom) {
        for (let i = 0; i < textAdventure.jsonConfigData.Rooms.length; i++) {
            if (_nameOfNewRoom === textAdventure.jsonConfigData.Rooms[i].name) {
                let theNewRoom = new textAdventure.Room(textAdventure.jsonConfigData.Rooms[i].name, textAdventure.jsonConfigData.Rooms[i].description, textAdventure.jsonConfigData.Rooms[i].person.police, textAdventure.jsonConfigData.Rooms[i].person.passanger, textAdventure.jsonConfigData.Rooms[i].person.salesman, textAdventure.jsonConfigData.Rooms[i].item, textAdventure.jsonConfigData.Rooms[i].neighbour);
                textAdventure.currentRoom = theNewRoom;
                textAdventure.jsonConfigData.User.currentRoom = textAdventure.currentRoom.name;
                printOutput("<b class='blue'>" + textAdventure.currentRoom.description + "</b><br/> <b>[h]</b> | Hilfe");
            }
        }
    }
    textAdventure.createNewRoom = createNewRoom;
    /**
     * Funktion gibt Commandos zurück welcher der User im jeweiligen Raum hat
     *
     * @return output: String
     */
    function outputCommands() {
        let output = "<b>[n]</b> | Norden <br/> <b>[s]</b> | Süden <br/> <b>[o]</b> | Osten <br/> <b>[w]</b> | Westen <br/> <b>[u]</b> | umschauen <br> <b>[l]</b> | Gesundheitszustand anzeigen <br/> <b>[i]</b> | Inventar öffnen <br/> ";
        if (getAllPersonsFromCurrentRoom().length != 0) {
            output = output + " <b>[r]</b> | reden <br/>";
        }
        if (textAdventure.currentRoom.item.length != 0) {
            output = output + "<b>[t]</b> | Item nehmen <br/>";
        }
        if (textAdventure.inventory.length > 0) {
            output = output + "<b>[a]</b> | Item ablegen <br/>";
        }
        let firstTime = true;
        for (let i = 0; i < getAllPersonsFromCurrentRoom().length; i++) {
            if (getAllPersonsFromCurrentRoom()[i] instanceof textAdventure.Police && firstTime) {
                output = output + "<b>[k]</b> | Polizei angreifen <br/>";
                firstTime = false;
            }
        }
        output = output + "-------------------------- <br/><b>[f]</b> | Spiel speichern </br><b>[q]</b> | Spiel verlassen";
        return output;
    }
    /**
     * Funktion fasst alle Polizisten, Passanten und Verkäufer im Akutellen Raum
     * in ein Personen Array zusammen und gibt dieses zurück
     *
     * @retrun allPersons: Person[] | Enthält alle Personen
     */
    function getAllPersonsFromCurrentRoom() {
        let allPersons = [];
        for (let i = 0; i < textAdventure.currentRoom.police.length; i++) {
            allPersons.push(textAdventure.currentRoom.police[i]);
        }
        for (let i = 0; i < textAdventure.currentRoom.passanger.length; i++) {
            allPersons.push(textAdventure.currentRoom.passanger[i]);
        }
        for (let i = 0; i < textAdventure.currentRoom.salesman.length; i++) {
            allPersons.push(textAdventure.currentRoom.salesman[i]);
        }
        return allPersons;
    }
    textAdventure.getAllPersonsFromCurrentRoom = getAllPersonsFromCurrentRoom;
    function gameWin() {
        textAdventure.gameSequenz = null;
        let gameWinText = "Herzlichen Glückwunsch " + textAdventure.jsonConfigData.User.name + " hast gewonnen!<br/>Die Polizei hat dich nicht geschnappt und du hast einen Unterschlupf gefunden<br/>in dem du dich verstecken kannst! <br/> <br/>";
        // Überprüft, ob überhaupt Geld im Inventar ist
        if (!((new RegExp(" Euro")).test(textAdventure.inventory[0].name))) {
            gameWinText = gameWinText + "Leider hast du kein Geld erbeutet.";
        }
        // Überprüft wie viel Geld im Inventar ist und gibt jenachem unterschiedliche ausgaben aus
        if ((new RegExp(" Euro")).test(textAdventure.inventory[0].name)) {
            gameWinText = gameWinText + "Du hast " + textAdventure.inventory[0].name + " von maximal 40000 Euro erbeutet. <br/>";
            let money = +textAdventure.inventory[0].name.split(" ")[0];
            if (money === 40000)
                gameWinText = gameWinText + "In der Garage befindet sich dein Komplize Jonny mit dem Fluchtfahrzeug. Ihr kommt ungesehen aus der Stadt und flüchtet nach Russland. Du lässt dein kriminelles Leben hinter dir und beginnst ein neues Leben auf einer Insel im pazifischen Ozean.";
            else if (money > 39000)
                gameWinText = gameWinText + "Du schnappst dir ein Fahrad aus der Garage und flüchtest aus der Stadt zu deiner Familie. Du kannst ihr mit dem Geld nun endlich das Leben ermöglichen, das du immer wolltest.";
            else if (money > 30000)
                gameWinText = gameWinText + "Du ziehst dich in der Garage um und flüchtest unbemerkt durch die Hintertür. Du lebst dein Leben normal in einer entfernet Stadt wieiter. Fünf Jahre später wurde der Fall neu aufgerollt. Durch deine DNA-Spuren an der Kleidung konntest du überführt werden. Es drohen dir nun 5 Jahre Haft.";
            else if (money > 21000)
                gameWinText = gameWinText + "Du flüchtest erfolgreich mit einem kleinen VW-Polo aus der Stadt. du bist überwältigt, wie schnell du eine Bank überfallen hast. In deinem Kopf planst du bereits den nächsten Überfall auf die Zentralbank.";
            else if (money >= 20000)
                gameWinText = gameWinText + "Mit einem Fluchfahrzeug in der Garage fährst du direkt ins nächstgelegene Casino. Innerhalb von 24 Stunden hast du dein komplettes Geld verspielt, woraufhin du neue Überfälle planst.";
            else if (money > 5000)
                gameWinText = gameWinText + "Du hast die Beute der Bank unterwegs abgelegt. Die Polizei fand daran Fingerabdrücke und konnte dich mit Hilfe eines Phantombildes identifizieren. Du wurdest zu 7 Jahren Haft verurteilt.";
            else if (money > 0)
                gameWinText = gameWinText + "Dein Komplize Jessy ist außer sich vor Wut über die geringe Ausbeute. Er lässt dich alleine in der Garage zurück. Du lässt dein kriminelles Leben hinter dir und kaufst dir vom Geld eine Kugel Eis. ";
            else if (money === 0)
                gameWinText = gameWinText + "Du hast leider kein Geld erbeutet. Während der Flucht hast du bemerkt, dass Geld nicht alles ist. Du bist froh, dass du den Polizisten entwischt bist und deine Freiheit hast.";
        }
        return "<div class='game-Win'><b>" + gameWinText + "</b><div>";
    }
    textAdventure.gameWin = gameWin;
    function gameOver(_gameOverText) {
        textAdventure.gameSequenz = null;
        return _gameOverText;
    }
    textAdventure.gameOver = gameOver;
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
        textAdventure.gameSequenz = null;
        return "Spiel beendet, bis zum nächsten Mal.";
    }
    /**
    * Funktion git den Aktuellen Lebenszustand des Spielers zurück
    *
    * @return: string | Lebenszustand des Spielers
    */
    function showlife() {
        return "Dein aktueller Gesundheitszustand ist: " + textAdventure.health + "%";
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
    textAdventure.printOutput = printOutput;
})(textAdventure || (textAdventure = {}));
var textAdventure;
(function (textAdventure) {
    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Osten ein Raum existiert
     */
    function walkToEast() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (textAdventure.currentRoom.neighbour[3] != null) {
            textAdventure.printOutput("Du läufst nach Osten.");
            let roomInEast = textAdventure.currentRoom.neighbour[3];
            textAdventure.createNewRoom(roomInEast);
        }
        else {
            textAdventure.printOutput("Nach Osten befindet sich kein Weg.");
        }
    }
    textAdventure.walkToEast = walkToEast;
    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Westen ein Raum existiert
     */
    function walkToWast() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (textAdventure.currentRoom.neighbour[2] != null && textAdventure.currentRoom.neighbour[2] != "Polizeiwache") {
            textAdventure.printOutput("Du läufst nach Westen.");
            let roomInWest = textAdventure.currentRoom.neighbour[2];
            textAdventure.createNewRoom(roomInWest);
        }
        else if (textAdventure.currentRoom.neighbour[2] === "Polizeiwache") {
            textAdventure.printOutput(textAdventure.gameOver("<div class='game-Over'><b>Du wurdest in der Polizeiwache identifiziert und festgenommen.<br/> Das Spiel ist vorbei.</b></div>"));
        }
        else {
            textAdventure.printOutput("Nach Westen befindet sich kein Weg.");
        }
    }
    textAdventure.walkToWast = walkToWast;
    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Süden ein Raum existiert
     */
    function walkToSouth() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (textAdventure.currentRoom.neighbour[1] != null && textAdventure.currentRoom.neighbour[1] != "Baustelle" && textAdventure.currentRoom.neighbour[1] != "Bank") {
            textAdventure.printOutput("Du läufst nach Süden.");
            let roomInSouth = textAdventure.currentRoom.neighbour[1];
            textAdventure.createNewRoom(roomInSouth);
        }
        else if (textAdventure.currentRoom.neighbour[1] === "Bank") {
            textAdventure.printOutput(textAdventure.gameOver("<div class='game-Over'> <b>Du bist zurück zum Tatort gelaufen und wurdest von der Polizei geschnappt. <br/> Das Spiel ist vorbei.</b><div/>"));
        }
        else if (textAdventure.currentRoom.neighbour[1] === "Baustelle") {
            textAdventure.printOutput("Hier befindet sich eine Baustelle, dieser Weg ist versperrt.");
        }
        else {
            textAdventure.printOutput("Nach Süden befindet sich kein Weg.");
        }
    }
    textAdventure.walkToSouth = walkToSouth;
    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Norden ein Raum existiert
     */
    function walkToNorth() {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (textAdventure.currentRoom.neighbour[0] != null && textAdventure.currentRoom.neighbour[0] != "Baustelle" && textAdventure.currentRoom.neighbour[0] != "Garage") {
            textAdventure.printOutput("Du läufst nach Norden.");
            let roomInNorth = textAdventure.currentRoom.neighbour[0];
            textAdventure.createNewRoom(roomInNorth);
        }
        else if (textAdventure.currentRoom.neighbour[0] === "Baustelle") {
            textAdventure.printOutput("Hier befindet sich eine Baustelle, dieser Weg ist versperrt.");
        }
        else if (textAdventure.currentRoom.neighbour[0] === "Garage") {
            // Überprüft, ob der Garagenschlüssel im Inventar ist
            let nokey = true;
            for (let i = 0; i < textAdventure.inventory.length; i++) {
                if (textAdventure.inventory[i].name === "Garagenschlüssel") {
                    textAdventure.printOutput("Garage mit Garagenschlüssel geöffnet");
                    // let roomInNorth: string = currentRoom.neighbour[0];
                    // createNewRoom(roomInNorth);
                    nokey = false;
                    textAdventure.printOutput(textAdventure.gameWin());
                }
            }
            if (nokey) {
                textAdventure.printOutput("Um in die Garage zu gelangen, brauchst du den Garagenschlüssel in deinem Inventar.");
            }
        }
        else {
            textAdventure.printOutput("Nach Norden befindet sich kein Weg.");
        }
    }
    textAdventure.walkToNorth = walkToNorth;
})(textAdventure || (textAdventure = {}));
var textAdventure;
(function (textAdventure) {
    function pullItemFromInventoryAndPushToRoom(_inputAsNumber) {
        for (let i = 0; i < textAdventure.inventory.length; i++) {
            if (i === _inputAsNumber - 1) {
                let item = textAdventure.inventory.splice(_inputAsNumber - 1, 1)[0];
                textAdventure.jsonConfigData.User.item.splice(_inputAsNumber - 1, 1);
                // Fügt das Item im akutellen Raum in die JSON-Datei ein
                textAdventure.jsonConfigData.Rooms[textAdventure.getIndexOfCurrentRoom(textAdventure.currentRoom)].item.push(item);
                textAdventure.currentRoom.item.push(item);
                textAdventure.printOutput("<p class='red'>&nbsp;- " + item.name + " abgelegt <p/>");
            }
        }
        textAdventure.gameSequenz = 2;
    }
    textAdventure.pullItemFromInventoryAndPushToRoom = pullItemFromInventoryAndPushToRoom;
    function dropItem() {
        let output = "";
        // Überprüfung, ob sich im Items im Inventar befinden
        if (textAdventure.inventory.length != 0) {
            output = output + "Folgende Gegenstände hast du im Inventar";
            for (let i = 0; i < textAdventure.inventory.length; i++) {
                output = output + "<br/>" + "<b>[" + [i + 1] + "]</b> " + textAdventure.inventory[i].name;
            }
            output = output + "<br/>Was möchtest du ablegen? <br/>Gebe die Nummer ein.";
            textAdventure.gameSequenz = 4;
        }
        else {
            output = output + "Du kannst nichts ablegen, da du keine Gegenstände im Inventar hast.";
        }
        textAdventure.printOutput(output);
    }
    textAdventure.dropItem = dropItem;
    function pullItemFromRoomAndPushToInventory(_userInputAsNumber) {
        for (let i = 0; i < textAdventure.currentRoom.item.length; i++) {
            if (i === _userInputAsNumber - 1) {
                // Nimmt das Item aus dem currentRoom heraus und speichert es in der Variable item
                let item = textAdventure.currentRoom.item.splice(_userInputAsNumber - 1, 1)[0];
                // Löscht des Item aus der JSON-Datei
                textAdventure.jsonConfigData.Rooms[textAdventure.getIndexOfCurrentRoom(textAdventure.currentRoom)].item.splice(_userInputAsNumber - 1, 1);
                let output = "";
                //Überprüft, ob das Item Geld ist, wenn ja wird es zusammenaddiert
                if ((new RegExp(" Euro")).test(item.name) || (new RegExp(" EURO")).test(item.name)) {
                    // Durchläuft das Akutelle Inventar
                    let oldInventoryLength = textAdventure.inventory.length;
                    let oldInventory = textAdventure.inventory;
                    for (let i = 0; i < oldInventoryLength; i++) {
                        // Wenn sich  Geld im Inventar befindet 
                        if ((new RegExp(" Euro")).test(oldInventory[i].name)) {
                            let oldMoneyItem = textAdventure.inventory.splice(i, 1)[i];
                            let oldMoney = +oldMoneyItem.name.split(" ")[0];
                            let pickedMoney = +item.name.split(" ")[0];
                            let newMoneyValue = oldMoney + pickedMoney;
                            let newMoney = new textAdventure.Item(newMoneyValue + " Euro");
                            //Entfernen des Alten Geld Items
                            textAdventure.inventory.slice(i, 1);
                            //Hinzufügen des neuen Geld Items (mit neuem Geld wert)
                            textAdventure.inventory.unshift(newMoney);
                            break;
                        }
                        else {
                            // Befindet sich noch kein Geld im Invantar oder Aktuelles Item ist kein Geld
                            textAdventure.inventory.unshift(item);
                            break;
                        }
                    }
                    if (textAdventure.inventory.length === 0) {
                        textAdventure.inventory.unshift(item);
                    }
                }
                else if (item.name === "Spritze") {
                    if (textAdventure.health + 50 < 100) {
                        textAdventure.health = textAdventure.health + 50;
                    }
                    else {
                        textAdventure.health = 100;
                    }
                    output = output + "<br/>Leben um 50% geheilt. Dein Gesundheitszustand beträgt nun " + textAdventure.health + "%.";
                }
                else if (item.name === "Verband") {
                    if (textAdventure.health + 25 < 100) {
                        textAdventure.health = textAdventure.health + 25;
                    }
                    else {
                        textAdventure.health = 100;
                    }
                    output = output + "<br/>Leben um 25% geheilt. Dein Gesundheitszustand beträgt nun " + textAdventure.health + "%.";
                }
                else if (item.name === "Hustensaft") {
                    if (textAdventure.health + 5 < 100) {
                        textAdventure.health = textAdventure.health + 5;
                    }
                    else {
                        textAdventure.health = 100;
                    }
                    output = output + "<br/>Leben um 5% geheilt. Dein Gesundheitszustand beträgt nun " + textAdventure.health + "%.";
                }
                else {
                    // Pusth das erstellte Item ins Inventar (wennes keine Spritze, Verband oder Hustensaft ist)
                    textAdventure.inventory.push(item);
                }
                textAdventure.printOutput("<p class='green'>&nbsp;+ " + item.name + " aufgenommen<p/>" + output);
            }
        }
        textAdventure.gameSequenz = 2;
    }
    textAdventure.pullItemFromRoomAndPushToInventory = pullItemFromRoomAndPushToInventory;
    function takeItem() {
        let output = "";
        // Überprüfung, ob sich im Raum Items befinden
        if (textAdventure.currentRoom.item.length != 0) {
            output = output + "Hier befinden sich folgende Gegenstände:";
            for (let i = 0; i < textAdventure.currentRoom.item.length; i++) {
                output = output + "<br/>" + "<b>[" + [i + 1] + "]</b> " + textAdventure.currentRoom.item[i].name;
            }
            output = output + "<br/>Was möchtest du aufnehmen? <br/>Gebe die Nummer ein.";
            textAdventure.gameSequenz = 3;
        }
        else {
            output = output + "Du kannst nichts aufnehmen, da sich hier kein Gegenstände befinden.";
        }
        textAdventure.printOutput(output);
    }
    textAdventure.takeItem = takeItem;
    function outputInventory() {
        let output = "";
        if (textAdventure.inventory.length === 0) {
            output = output + "In deinem Inventar befinden sich keine Gegenstände.";
        }
        else {
            output = output + "In deinem Inventar befinden sich:";
            for (let i = 0; i < textAdventure.inventory.length; i++) {
                output = output + "<br/> - " + textAdventure.inventory[i].name;
            }
        }
        return output;
    }
    textAdventure.outputInventory = outputInventory;
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