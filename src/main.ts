
namespace textAdventure {
    let gameSequenz: number = 0; // Spiel Sequenz in welcher sich der Spieler befindet
    let jsonConfigData: JSONData; // Json Datei

    let currentRoom: Room; // Akuteller Raum 
    let money: Item; // Akutelles Geld
    let inventory: Item[] = []; // Inventar 
    let health: number; // Lebensanzeige

    loadJsonData();

    let inputField: HTMLInputElement = document.getElementById("inputField") as HTMLInputElement;
    inputField.addEventListener("keyup", function (_event: KeyboardEvent): void {
        if (_event.key === "Enter") {
            let inputValue: string = inputField.value.toLowerCase();
            checkUsersChoice(inputValue);
            inputField.value = "";
        }
    });

    /**
     * Funktion startet das Spiel
     * 
     * @param _content: JSONObject | Enthält alle Daten des Spieles
     */
    export function startProgram(_content: JSONData): void {
        jsonConfigData = _content;
        // Fuege das anfang Item zum Inventar hinzu
        // inventory.push(new Item(jsonConfigData.User.item[0].name));
        if (gameSequenz === 0) {
            printOutput("Willkommen bei ESCAPE. <br/> Starte ein neues Spiel, gebe „start“. <br/> Laden einen Spielstand „load“.");
            //Fuege das Geld der JSON Datei in die Money Variable und ins Inventar ein
            money = new Item(jsonConfigData.User.item[0].name);
            inventory.push(money);
        } else {
            createNewRoom(jsonConfigData.User.currentRoom);
            health = jsonConfigData.User.health;
            gameSequenz = 2;
        }
    }

    /**
     * Funktion reagiert auf den User Input und ruft weitere Funktionen auf - je nach Input
     * 
     * @param _userInput: String | Eingabe welche der User im Input Feld eingibt
     */
    function checkUsersChoice(_userInput: string): void {
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
                    case "speichern":
                    case "f":
                        saveGame();
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
                let userInputAsNumber: number = +_userInput;
                if (Number.isInteger(userInputAsNumber) && _userInput != "") {
                    pullItemFromRoomAndPushToInventory(userInputAsNumber);
                } else {
                    printOutput("Falsche eingabe");
                }
                break;
            // Item Ablegen
            case 4:
                let inputAsNumber: number = +_userInput;
                if (Number.isInteger(inputAsNumber) && _userInput != "") {
                    pullItemFromInventoryAndPushToRoom(inputAsNumber);
                } else {
                    printOutput("Falsche eingabe");
                }
                break;
            // Mit Person reden
            case 5:
                let inputNumber: number = +_userInput;
                if (Number.isInteger(inputNumber) && _userInput != "") {
                    talkWithTheRightPerson(inputNumber);
                } else {
                    printOutput("Falsche eingabe");
                }
                break;
            // Polizei angreifen
            case 6:
                let inNumber: number = +_userInput;
                if (Number.isInteger(inNumber) && _userInput != "") {
                    attackThePickedPolice(inNumber);
                } else {
                    printOutput("Falsche eingabe");
                }
                break;
            default:
                break;
        }
    }


    function saveGame(): void {
        //Aktuelles Inventar wird in die JSON-Datei geschrieben
        jsonConfigData.User.item = inventory;
        //Aktueller Lebensstand wird in die JSON-Datei geschrieben
        jsonConfigData.User.health = health;
        printOutput("Das Spiel wird gespeichert. Schaue in deinen Downloads Ordner.");
        save(jsonConfigData, "gameData");
    }
    function attackThePickedPolice(_inNumber: number): void {
        let output: string = "";
        // Leben abziehen
        health = health - 40;
        // Leben in der JSON-Datei Abziehen
        jsonConfigData.User.health = health;
        // Überprüfen, des aktuellen Lebens (Wenn unter 0, ist das Spiel verloren)
        if (0 >= health) {
            printOutput(gameOver("Die Polizei hat im Kampf gegen dich gewonnen. Du hattest zu wenig Leben.<br/>Das Spiel ist vorbei"));
        } else {
            // Durläuft alle Personen im Aktuellen Raum
            for (let i: number = 0; i < getAllPersons().length; i++) {
                // Schaut, ob die Person ein Polizist ist
                if (getAllPersons()[i] instanceof Police) {
                    // Pickt sich den Polizist, welcher sich hinter der eingegebenen Nummer verbirgt
                    if (i === _inNumber - 1) {
                        output = output + "Du hast den Polizist " + getAllPersons()[i].name + " angegriffen.<br/> Dieser ist nun bewusstlos und hat seine Gegenstände verloren.<br/>Du hast 40% Leben Verloren";
                    }
                }
            }
            // Hinzufügen der Items des Polizist zum currentRoom

            let attackedPoliceItemsArray: Item[] = jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].person.polizei[_inNumber - 1].item;
            for (let i: number = 0; i < attackedPoliceItemsArray.length; i++) {
                let theItem: Item = new Item(attackedPoliceItemsArray[i].name);
                // Item zum Aktuellen Raum hinzufügen
                currentRoom.item.push(theItem);
                // Item in der JSON-Datei hinzufügen
                jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].item.push(theItem);
            }
            // Entfernt den Polizisten aus der JSON-Datei
            jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].person.polizei.splice(_inNumber - 1, _inNumber);
            // Entfernt des Polizisten aus dem aktuellen Raum
            currentRoom.police.splice(_inNumber - 1, _inNumber);

            printOutput(output);
            gameSequenz = 2;
        }
    }

    function attackPolice(): void {
        let output: string = "";
        // Überprüft, ob ein im aktuellen Raum ist
        if (currentRoom.police.length != 0) {
            output = output + "Welchen Polizisten möchtest du angreifen?";
            for (let i: number = 0; i < getAllPersons().length; i++) {
                if (getAllPersons()[i] instanceof Police) {
                    output = output + "<br/>" + "[" + [i + 1] + "]" + " Polizei | " + getAllPersons()[i].name;
                }
            }
            output = output + "<br/>Gebe die Nummer ein";
        } else {
            output = output + "Hier befindet sich kein Polizist.";
        }
        printOutput(output);
        gameSequenz = 6;
    }

    function talkWithTheRightPerson(_inputNumber: number): void {
        for (let i: number = 0; i < getAllPersons().length; i++) {
            if (i === _inputNumber - 1) {
                if (getAllPersons()[i] instanceof Police) {
                    printOutput(getAllPoliceman()[i].name + ": " + "<i>" + getAllPoliceman()[i].text + "</i>");
                }
                if (getAllPersons()[i] instanceof Passanger) {
                    if ((Math.floor(Math.random() * Math.floor(2))) === 1) {
                        printOutput(getAllPassanger()[i - getAllPoliceman().length].name + ": " + "<i>" + getAllPassanger()[i - getAllPoliceman().length].text + "</i>");
                    } else {
                        printOutput(getAllPassanger()[i - getAllPoliceman().length].name + ": " + "<i>" + getAllPassanger()[i - getAllPoliceman().length].text2 + "</i>");
                    }
                }
                if (getAllPersons()[i] instanceof Salesman) {
                    if ((Math.floor(Math.random() * Math.floor(2))) === 1) {
                        printOutput(getAllSalesman()[i - (getAllPoliceman().length + getAllPassanger().length)].name + ": " + "<i>" + getAllSalesman()[i - (getAllPoliceman().length + getAllPassanger().length)].text + "</i>");
                    } else {
                        printOutput(getAllSalesman()[i - (getAllPoliceman().length + getAllPassanger().length)].name + ": " + "<i>" + getAllSalesman()[i - (getAllPoliceman().length + getAllPassanger().length)].text2 + "</i>");
                    }
                }
            }
        }
        gameSequenz = 2;
    }


    function talkWithPerson(): void {
        let output: string = "";
        if (getAllPersons().length != 0) {
            output = output + "Mit wem möchtest du Reden?";
            for (let i: number = 0; i < getAllPersons().length; i++) {
                if (getAllPersons()[i] instanceof Police) {
                    output = output + "<br/>" + "[" + [i + 1] + "]" + " Polizei | " + getAllPersons()[i].name;
                }
                if (getAllPersons()[i] instanceof Passanger) {
                    output = output + "<br/>" + "[" + [i + 1] + "]" + " Passant | " + getAllPersons()[i].name;
                }
                if (getAllPersons()[i] instanceof Salesman) {
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
    function showlife(): string {
        return "Dein aktueller Gesundheitszustand ist: " + health + "%";
    }

    function pullItemFromInventoryAndPushToRoom(_inputAsNumber: number): void {
        for (let i: number = 0; i < inventory.length; i++) {
            if (i === _inputAsNumber - 1) {
                let item: Item = inventory.splice(_inputAsNumber - 1, 1)[0];
                jsonConfigData.User.item.splice(_inputAsNumber - 1, 1);
                // Fügt das Item im akutellen Raum in die JSON-Datei ein
                jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].item.push(item);
                currentRoom.item.push(item);
                printOutput("<p class='red'>&nbsp;- " + item.name + " abgelegt <p/>");
            }
        }
        gameSequenz = 2;
    }

    function dropItem(): void {
        let output: string = "";
        // Überprüfung, ob sich im Items im Inventar befinden
        if (inventory.length != 0) {
            output = output + "Folgende Gegenstände hast du im Inventar";
            for (let i: number = 0; i < inventory.length; i++) {
                output = output + "<br/>" + "[" + [i + 1] + "] " + inventory[i].name;
            }
            output = output + "<br/>Was möchtest du ablegen? <br/>Gebe die Nummer ein.";
            gameSequenz = 4;
        } else {
            output = output + "Du kannst nichts ablegen, da du keine Gegenstände im Inventar hast.";
        }
        printOutput(output);
    }

    function getIndexOfCurrentRoom(_currentRom: Room): number {
        let index: number;
        for (let i: number = 0; i < jsonConfigData.Rooms.length; i++) {
            if (_currentRom.name === jsonConfigData.Rooms[i].name) {
                index = i;
            }
        }
        return index;
    }

    function pullItemFromRoomAndPushToInventory(_userInputAsNumber: number): void {
        for (let i: number = 0; i < currentRoom.item.length; i++) {
            if (i === _userInputAsNumber - 1) {
                // Nimmt das Item aus dem currentRoom heraus und speichert es in der Variable item
                let item: Item = currentRoom.item.splice(_userInputAsNumber - 1, 1)[0];
                // Löscht des Item aus der JSON-Datei
                jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].item.splice(_userInputAsNumber - 1, 1);
                let output: string = "";
                //Überprüft, ob das Item Geld ist, wenn ja wird es zusammenaddiert
                if ((new RegExp(" Euro")).test(item.name) || (new RegExp(" EURO")).test(item.name)) {

                    // Durchläuft das Akutelle Inventar
                    let oldInventoryLength: number = inventory.length;
                    let oldInventory: Item[] = inventory;
                    for (let i: number = 0; i < oldInventoryLength; i++) {
                        // Wenn sich  Geld im Inventar befindet 
                        if ((new RegExp(" Euro")).test(oldInventory[i].name)) {
                            let oldMoneyItem: Item = inventory.splice(i, 1)[i];
                            let oldMoney: number = +oldMoneyItem.name.split(" ")[0];

                            let pickedMoney: number = +item.name.split(" ")[0];

                            let newMoneyValue: number = oldMoney + pickedMoney;
                            let newMoney: Item = new Item(newMoneyValue + " Euro");

                            //Entfernen des Alten Geld Items
                            inventory.slice(i, 1);
                            //Hinzufügen des neuen Geld Items (mit neuem Geld wert)
                            inventory.unshift(newMoney);
                            break;
                        } else {
                            // Befindet sich noch kein Geld im Invantar oder Aktuelles Item ist kein Geld
                            inventory.unshift(item);
                            break;
                        }
                    }
                    if (inventory.length === 0) {
                        inventory.unshift(item);
                    }
                } else if (item.name === "Spritze") {
                    if (health + 50 < 100) {
                        health = health + 50;
                    } else {
                        health = 100;
                    }
                    output = output + "<br/>Leben um 50% geheilt.";
                } else if (item.name === "Verband") {
                    if (health + 25 < 100) {
                        health = health + 25;
                    } else {
                        health = 100;
                    }
                    output = output + "<br/>Leben um 25% geheilt.";
                } else if (item.name === "Hustensaft") {
                    if (health + 5 < 100) {
                        health = health + 5;
                    } else {
                        health = 100;
                    }
                    output = output + "<br/>Leben um 5% geheilt.";
                } else {
                    // Pusth das erstellte Item ins Inventar (wennes keine Spritze, Verband oder Hustensaft ist)
                    inventory.push(item);
                }
                printOutput("<p class='green'>&nbsp;+ " + item.name + " aufgenommen<p/>");
            }
        }
        gameSequenz = 2;
    }

    function takeItem(): void {
        let output: string = "";
        // Überprüfung, ob sich im Raum Items befinden
        if (currentRoom.item.length != 0) {
            output = output + "Hier befinden sich folgende Gegenstände:";
            for (let i: number = 0; i < currentRoom.item.length; i++) {
                output = output + "<br/>" + "[" + [i + 1] + "] " + currentRoom.item[i].name;
            }
            output = output + "<br/>Was möchtest du aufnehmen? <br/>Gebe die Nummer ein.";
            gameSequenz = 3;
        } else {
            output = output + "Du kannst nichts aufnehmen, da sich hier kein Gegenstände befinden.";
        }
        printOutput(output);
    }

    function outputInventory(): string {
        let output: string = "In deinem Inventar befinden sich:";
        for (let i: number = 0; i < inventory.length; i++) {
            output = output + "<br/> - " + inventory[i].name;
        }
        return output;
    }


    function startGameRegulary(_userInput: string): void {
        // Setzt Spielername in der JSON-Datei
        jsonConfigData.User.name = _userInput;
        gameSequenz++;
        printOutput("Hallo " + _userInput.toUpperCase() + " das Spiel startet in:");
        let timerNumber: number = 3;
        let refreshIntervalId: number = setInterval(function (): void {
            if (timerNumber < 2)
                clearInterval(refreshIntervalId);
            printOutput("<p class='red'>" + timerNumber.toString() + "<p/>");
            timerNumber--;
            // tslint:disable-next-line: align
        }, 700);
        setTimeout(function (): void {
            let output: string = "Du befindest dich in der Bank und hast gerade den Schalter überfallen und dabei 20000 Euro erbeutet, flüchte so schnell wie möglich! <br/> <b>[h]</b> | Hilfe";
            printOutput(output);
            // tslint:disable-next-line: align
        }, 2800);
        // Setzt den Anfangsraum fest
        let bank: Room = new Room(jsonConfigData.Rooms[0].name, jsonConfigData.Rooms[0].description, jsonConfigData.Rooms[0].person.polizei, jsonConfigData.Rooms[0].person.passant, jsonConfigData.Rooms[0].person.verkaeufer, jsonConfigData.Rooms[0].item, jsonConfigData.Rooms[0].neighbour);
        currentRoom = bank;
        // Setzt das Anfangsleben fest
        health = jsonConfigData.User.health;
    }

    function loadUsersJSONData(): void {
        printOutput("<input id='loadFileButton' accept='.json' type='file'>");
        let loadFileButton: HTMLInputElement = document.getElementById("loadFileButton") as HTMLInputElement;
        loadFileButton.addEventListener("change", function (): void {
            let fr: FileReader = new FileReader();
            fr.onload = function (): void {
                // Überschreibt die jsonConfigData variable mit dem hochgeladenen Json-File
                jsonConfigData = JSON.parse(fr.result.toString());
                // Deaktiviert den Button
                loadFileButton.setAttribute("disabled", "");
                printOutput("Wilkommen zurück " + (jsonConfigData.User.name).toUpperCase());
                gameSequenz++;
                startProgram(JSON.parse(fr.result.toString()));
            };
            fr.readAsText(this.files[0]);
        });
    }

    function outputPersonsInRoom(): string {
        let output: string = "";
        if (getAllPersons().length != 0) {
            output = output + "Hier befinden sich folgende Personen:";
            for (let i: number = 0; i < getAllPersons().length; i++) {
                if (getAllPersons()[i] instanceof Police) {
                    output = output + "<br/> Polizei | " + getAllPersons()[i].name;
                }
                if (getAllPersons()[i] instanceof Passanger) {
                    output = output + "<br/> Passant | " + getAllPersons()[i].name;
                }
                if (getAllPersons()[i] instanceof Salesman) {
                    output = output + "<br/> Verkäufer | " + getAllPersons()[i].name;
                }
            }
        } else {
            output = output + "Hier befinden sich keine Personen";

        }

        return output;
    }

    function outputItemsInRoom(): string {
        let output: string = "";
        // Überprüfung, ob sich im Raum Items befinden
        if (currentRoom.item.length != 0) {
            output = output + "Hier befinden sich folgende Gegenstände:";
            for (let i: number = 0; i < currentRoom.item.length; i++) {
                output = output + "<br/> - " + currentRoom.item[i].name;
            }
        } else {
            output = output + "Hier befinden sich keine Gegenstände";
        }
        return output;
    }

    /**
     * Funktion gibt den Beschreibungstext des aktuellen Raumes zurück
     * 
     * @return: String | Beschreibungstext des Raumes
     */
    function lookAroundRoom(): string {
        return outputItemsInRoom() + "<br/>" + outputPersonsInRoom();
    }

    /**
     * Funktion beendet das Spiel
     */
    function quitGame(): string {
        gameSequenz = null;
        return "Spiel beendet, bis zum nächsten mal.";
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Osten ein Raum existiert 
     */
    function walkToEast(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[3] != null) {
            printOutput("Du läufst nach Osten");
            let roomInEast: string = currentRoom.neighbour[3];
            createNewRoom(roomInEast);
        } else {
            printOutput("Nach Osten befindet sich kein Weg.");
        }
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Westen ein Raum existiert 
     */
    function walkToWast(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[2] != null && currentRoom.neighbour[2] != "Polizeiwache") {
            printOutput("Du läufst nach Westen");
            let roomInWest: string = currentRoom.neighbour[2];
            createNewRoom(roomInWest);
        } else if (currentRoom.neighbour[2] === "Polizeiwache") {
            printOutput(gameOver("Du wurdest in der Polizeiwache identifiziert und Festgenommen.<br/> Das Spiel ist vorbei."));
        } else {
            printOutput("Nach Westen befindet sich kein Weg.");
        }
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Süden ein Raum existiert 
     */
    function walkToSouth(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[1] != null && currentRoom.neighbour[1] != "Baustelle" && currentRoom.neighbour[1] != "Bank") {
            printOutput("Du läufst nach Süden");
            let roomInSouth: string = currentRoom.neighbour[1];
            createNewRoom(roomInSouth);
        } else if (currentRoom.neighbour[1] === "Bank") {
            printOutput(gameOver("Du bist zurück zum Tatort zurück gelaufen und wurdest von der Polizei geschnappt. <br/> Das Spiel ist vorbei."));
        } else if (currentRoom.neighbour[1] === "Baustelle") {
            printOutput("Hier befindet sich eine Baustelle, dieser Weg ist versperrt.");
        }
        else {
            printOutput("Nach Süden befindet sich kein Weg.");
        }
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Norden ein Raum existiert 
     */
    function walkToNorth(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[0] != null && currentRoom.neighbour[0] != "Baustelle" && currentRoom.neighbour[0] != "Garage") {
            printOutput("Du läufst nach Norden");
            let roomInNorth: string = currentRoom.neighbour[0];
            createNewRoom(roomInNorth);
        } else if (currentRoom.neighbour[0] === "Baustelle") {
            printOutput("Hier befindet sich eine Baustelle, dieser Weg ist versperrt.");
        } else if (currentRoom.neighbour[0] === "Garage") {
            // Überprüft, ob der Garagenschlüssel im Inventar ist
            let nokey: boolean = true;
            for (let i: number = 0; i < inventory.length; i++) {
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
        } else {
            printOutput("Nach Norden befindet sich kein Weg.");
        }

    }

    /**
     * Funktion erzeugt ein neues Raum-Objekt, welche anschließend in der "currentRoom" variable gespeichert wird
     * 
     * @param _nameOfNewRoom: String | Name des Raumes in welchen man navigieren möchte
     */
    function createNewRoom(_nameOfNewRoom: string): void {
        for (let i: number = 0; i < jsonConfigData.Rooms.length; i++) {
            if (_nameOfNewRoom === jsonConfigData.Rooms[i].name) {
                let theNewRoom: Room = new Room(jsonConfigData.Rooms[i].name, jsonConfigData.Rooms[i].description, jsonConfigData.Rooms[i].person.polizei, jsonConfigData.Rooms[i].person.passant, jsonConfigData.Rooms[i].person.verkaeufer, jsonConfigData.Rooms[i].item, jsonConfigData.Rooms[i].neighbour);
                currentRoom = theNewRoom;
                jsonConfigData.User.currentRoom = currentRoom.name;
                printOutput("<b class='brown'>" + currentRoom.description + "</b><br/> <b>[h]</b> | Hilfe");
            }
        }
    }


    /**
     * Funktion gibt Commandos zurück welcher der User im jeweiligen Raum hat
     * 
     * @return output: String 
     */
    function outputCommands(): string {
        let output: string = "<b>[n]</b> | Norden <br/> <b>[s]</b> | Süden <br/> <b>[o]</b> | Osten <br/> <b>[w]</b> | Westen <br/> <b>[u]</b> | umschauen <br> <b>[l]</b> | Gesundheitszustand anzeigen <br/> <b>[i]</b> | Inventar öffnen <br/> ";
        if (getAllPersons().length != 0) {
            output = output + " <b>[r]</b> | reden <br/>";
        }
        if (currentRoom.item.length != 0) {
            output = output + "<b>[t]</b> | Item nehmen <br/>";
        }
        if (inventory.length > 0) {
            output = output + "<b>[a]</b> | Item ablegen <br/>";
        }
        let firstTime: boolean = true;
        for (let i: number = 0; i < getAllPersons().length; i++) {
            if (getAllPersons()[i] instanceof Police && firstTime) {
                output = output + "<b>[k]</b> | Polizei angreifen <br/>";
                firstTime = false;
            }
        }
        output = output + "-------------------------- <br/><b>[q]</b> | Spiel verlassen";
        return output;
    }


    /**
     * Funktion fasst alle Polizisten, Passanten und Verkäufer im Akutellen Raum 
     * in ein Personen Array zusammen und gibt dieses zurück
     * 
     * @retrun allPersons: Person[] | Enthält alle Personen
     */
    function getAllPersons(): Person[] {
        let allPersons: Person[] = [];

        for (let i: number = 0; i < currentRoom.police.length; i++) {
            allPersons.push(currentRoom.police[i]);
        }
        for (let i: number = 0; i < currentRoom.passanger.length; i++) {
            allPersons.push(currentRoom.passanger[i]);
        }
        for (let i: number = 0; i < currentRoom.salesman.length; i++) {
            allPersons.push(currentRoom.salesman[i]);
        }
        return allPersons;
    }

    function getAllPoliceman(): Police[] {
        let allPoliceman: Police[] = [];
        for (let i: number = 0; i < currentRoom.police.length; i++) {
            allPoliceman.push(currentRoom.police[i]);
        }
        return allPoliceman;
    }
    function getAllPassanger(): Passanger[] {
        let allPassanger: Passanger[] = [];
        for (let i: number = 0; i < currentRoom.passanger.length; i++) {
            allPassanger.push(currentRoom.passanger[i]);
        }
        return allPassanger;
    }
    function getAllSalesman(): Salesman[] {
        let allSalesman: Salesman[] = [];
        for (let i: number = 0; i < currentRoom.salesman.length; i++) {
            allSalesman.push(currentRoom.salesman[i]);
        }
        return allSalesman;
    }

    function gameOver(_gameOverText: string): string {
        gameSequenz = null;
        return _gameOverText;
    }
    function gameWin(): string {
        gameSequenz = null;
        let gameWinText: string = "Herzlichen Glückwunsch du hast Gewonnen!<br/>Die Polizei hat dich nicht geschnappt und du hast einen Unterschlupf gefunden<br/>in dem du dich verstecken kannst! <br/>";
        // Überprüft, ob überhaupt Geld im Inventar ist
        if (!((new RegExp(" Euro")).test(inventory[0].name))) {
            gameWinText = gameWinText + "Leider hast du kein Geld erbeutet.";
        }
        // Überprüft wie viel Geld im Inventar ist und gibt jenachem unterschiedliche ausgaben aus
        if ((new RegExp(" Euro")).test(inventory[0].name)) {
            gameWinText = gameWinText + "Du hast " + inventory[0].name + " von maximal 37000 Euro erbeutet. <br/>";
            let money: number = +inventory[0].name.split(" ")[0];
            if (money > 35000)
                gameWinText = gameWinText + "Mit deinem Geld kaufst du in einem anderen Land ein Haus.";
            else if (money > 25000)
                gameWinText = gameWinText + "Mit deinem Geld kaufst du dir ein Teures Auto und führst ein schönes Leben.";
            else if (money > 15000)
                gameWinText = gameWinText + "Mit deinem Geld kaufst du dir eine Rolex und lebst dein Leben normal weiter.";
            else if (money > 5000)
                gameWinText = gameWinText + "Mit deinem Geld lebst du normal weiter, da es nicht für größere Ausgaben reicht.";
        }
        return gameWinText;
    }

    /**
     * Funktion fuegt den übergebenen String dem HTML-Dokument hinzu
     * 
     * @param _theOutputString: String | String welcher ausgegeben werden soll
     */
    function printOutput(_theOutputString: string): void {
        let divConsole: HTMLDivElement = document.getElementById("console") as HTMLDivElement;
        divConsole.innerHTML += _theOutputString + "<br/>" + "<hr>"; // Fuegt Inhalt in den Div-Console Container ein
        divConsole.scrollTop = divConsole.scrollHeight - divConsole.clientHeight;   // Nach jeder neuen Consolen Ausgabe nach unten Scrollen
    }
}