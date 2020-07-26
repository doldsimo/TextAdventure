
namespace textAdventure {
    let gameSequenz: number = 0; // Spiel Sequenz in welcher sich der Spieler befindet
    let jsonConfigData: any = []; // Json Datei

    let currentRoom: Room; // Akuteller Raum 
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
    export function startProgram(_content: JSONObject): void {
        jsonConfigData = _content;
        // Fuege das anfang Item zum Inventar hinzu
        inventory.push(new Item(jsonConfigData.User.item[0].name));
        if (gameSequenz === 0) {
            printOutput("Willkommen bei ESCAPE. <br/> Starte ein neues Spiel, gebe „start“. <br/> Laden einen Spielstand „load“.");
        } else {
            createNewRoom(jsonConfigData.User.currentRoom);
            health = jsonConfigData.User.health;
            gameSequenz = 2;
        }
        getUserInput();
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
                        ;
                        break;
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
            default:
                break;
        }
    }

    function showlife(): string {
        return "Dein aktueller Gesundheitszustand ist: " + health + "%";
    }

    function pullItemFromInventoryAndPushToRoom(_inputAsNumber: number): void {
        for (let i: number = 0; i < inventory.length; i++) {
            if (i === _inputAsNumber - 1) {
                let item: Item = inventory.splice(_inputAsNumber - 1, _inputAsNumber)[0];
                // Fügt das Item im akutellen Raum in die JSON-Datei ein
                jsonConfigData[currentRoom.name].item.push(item);
                currentRoom.item.push(item);
                printOutput(item.name + " abgelegt");
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
        } else {
            output = output + "Du hast keine Gegenstände im Inventar";
        }
        output = output + "<br/>Was möchtest du ablegen? <br/>Gebe die Nummer ein.";
        printOutput(output);
        gameSequenz = 4;
    }

    function pullItemFromRoomAndPushToInventory(_userInputAsNumber: number): void {
        for (let i: number = 0; i < currentRoom.item.length; i++) {
            if (i === _userInputAsNumber - 1) {
                let item: Item = currentRoom.item.splice(_userInputAsNumber - 1, _userInputAsNumber)[0];
                // Löscht des Item aus der JSON-Datei
                jsonConfigData[currentRoom.name].item.splice(_userInputAsNumber - 1, _userInputAsNumber);
                inventory.push(item);
                printOutput(item.name + " aufgenommen");
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
        } else {
            output = output + "Hier befinden sich keine Gegenstände";
        }
        output = output + "<br/>Was möchtest du aufnehmen? <br/>Gebe die Nummer ein.";
        printOutput(output);
        gameSequenz = 3;
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
            printOutput(timerNumber.toString());
            timerNumber--;
            // tslint:disable-next-line: align
        }, 700);
        setTimeout(function (): void {
            let output: string = "Du befindest dich in der Bank und hast gerade den Schalter überfallen, flüchte so schnell wie möglich! <br/> [h] | Hilfe";
            printOutput(output);
            // tslint:disable-next-line: align
        }, 2800);
        // Setzt den Anfangsraum fest
        let bank: Room = new Room(jsonConfigData.Bank.name, jsonConfigData.Bank.description, jsonConfigData.Bank.person.polizei, jsonConfigData.Bank.person.passant, jsonConfigData.Bank.person.verkaeufer, jsonConfigData.Bank.item, jsonConfigData.Bank.neighbour);
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
                printOutput("Wilkommen zurück " + jsonConfigData.User.name);
                gameSequenz++;
                startProgram(JSON.parse(fr.result.toString()));
            };
            fr.readAsText(this.files[0]);
        });
    }

    function outputPersonsInRoom(): string {
        let output: string = "";
        if (currentRoom.person.length != 0) {
            output = output + "Hier befinden sich folgende Personen:";
            for (let i: number = 0; i < currentRoom.person.length; i++) {
                if (currentRoom.person[i] instanceof Police) {
                    output = output + "<br/> Polizei | " + currentRoom.person[i].name;
                }
                if (currentRoom.person[i] instanceof Passanger) {
                    output = output + "<br/> Passant | " + currentRoom.person[i].name;
                }
                if (currentRoom.person[i] instanceof Salesman) {
                    output = output + "<br/> Verkäufer | " + currentRoom.person[i].name;
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
            printOutput("In Osten befindet sich kein Raum");
        }
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Westen ein Raum existiert 
     */
    function walkToWast(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[2] != null) {
            printOutput("Du läufst nach Westen");
            let roomInWest: string = currentRoom.neighbour[2];
            createNewRoom(roomInWest);
        } else {
            printOutput("In Westen befindet sich kein Raum");
        }
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Süden ein Raum existiert 
     */
    function walkToSouth(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[1] != null && currentRoom.neighbour[1] != "Baustelle") {
            printOutput("Du läufst nach Süden");
            let roomInSouth: string = currentRoom.neighbour[1];
            createNewRoom(roomInSouth);
        } else if (currentRoom.neighbour[1] === "Baustelle") {
            printOutput("Hier befindet sich eine Baustelle, dieser Weg ist versperrt.");
        }
        else {
            printOutput("In Süden befindet sich kein Raum");
        }
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Norden ein Raum existiert 
     */
    function walkToNorth(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[0] != null && currentRoom.neighbour[0] != "Baustelle") {
            printOutput("Du läufst nach Norden");
            let roomInNorth: string = currentRoom.neighbour[0];
            createNewRoom(roomInNorth);
        } else if (currentRoom.neighbour[0] === "Baustelle") {
            printOutput("Hier befindet sich eine Baustelle, dieser Weg ist versperrt.");
        } else {
            printOutput("In Norden befindet sich kein Raum");
        }

    }

    /**
     * Funktion erzeugt ein neues Raum-Objekt, welche anschließend in der "currentRoom" variable gespeichert wird
     * 
     * @param _nameOfNewRoom: String | Name des Raumes in welchen man navigieren möchte
     */
    function createNewRoom(_nameOfNewRoom: string): void {
        // Durchlaufen des jsonConfigData Files
        for (let obj in jsonConfigData) {
            // Überprüfung, dass es ein Objekt der Obersten ebene ist
            if (jsonConfigData.hasOwnProperty(obj)) {
                // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                if (obj === _nameOfNewRoom) {
                    let theNewRoom: Room = new Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person.polizei, jsonConfigData[obj].person.passant, jsonConfigData[obj].person.verkaeufer, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
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
    function outputCommands(): string {
        let output: string = "[n] | Norden <br/> [s] | Süden <br/> [o] | Osten <br/> [w] | Westen <br/>[u] | umschauen <br> [l] | Gesundheitszustand anzeigen <br/> [i] | Inventar öffnen <br/> ";
        if (currentRoom.person.length != 0) {
            output = output + " [r] | reden <br/>";
        }
        if (currentRoom.item.length != 0) {
            output = output + "[t] | Item nehmen <br/>";
        }
        if (inventory.length > 0) {
            output = output + "[a] | Item ablegen <br/>";
        }
        let firstTime: boolean = true;
        for (let i: number = 0; i < currentRoom.person.length; i++) {
            if (currentRoom.person[i] instanceof Police && firstTime) {
                output = output + "[z] | Polizei angreifen <br/>";
                firstTime = false;
            }
        }
        output = output + "-------------------------- <br/>[q] | Spiel verlassen";
        return output;
    }

    /**
     * Funktion löst Event aus, sobald der User etwas ins Input Feld eingegeben hat und mit Enter bestätigt hat
     */
    function getUserInput(): void {

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