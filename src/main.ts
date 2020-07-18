namespace textAdventure {
    let gameSequenz: number = 0;
    let jsonConfigData: any = [];
    let currentRoom: Room;

    loadJsonData();

    export function startProgram(_content: JSONObject): void {
        jsonConfigData = _content;
        printOutput("Zum Starten des Spieles, gebe „start“ ein.");
        getUserInput();
        // saveJsonData(_content);
    }

    function checkUsersChoice(_userInput: string): void {
        // Spiel kann immer mit "q" oder "beenden" beendet werden
        if (_userInput === "q" || _userInput === "beenden") {
            printOutput(quitGame());
        }
        // Spieler wird aufgefordert seinen Namen einzugeben
        if (gameSequenz === 0) {
            if (_userInput === "start") {
                printOutput("Das Spiel wird gestartet, gebe bitte deinen Namen ein.");
                gameSequenz++;
            } else {
                printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe. Zum Starten des Spieles Start eingeben!");
            }
        }
        // Das Spiel startet im ersten Raum  
        else if (gameSequenz === 1) {
            // Setzt Spielername in der JSON-Datei
            jsonConfigData.User.name = _userInput;
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
                gameSequenz++;
                printOutput("Du befindest dich in der Bank und hast gerade den Schalter überfallen, flüchte so schnell wie möglich! <br/> [h] | hilfe ");
                // tslint:disable-next-line: align
            }, 2800);
            let bank: Room = new Room(jsonConfigData.Bank.name, jsonConfigData.Bank.description, jsonConfigData.Bank.person, jsonConfigData.Bank.item, jsonConfigData.Bank.neighbour);
            currentRoom = bank;
            jsonConfigData.User.currentRoom = currentRoom;
            console.log(jsonConfigData);

        } else if (gameSequenz === 2) {
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

    function quitGame(): string {
        gameSequenz = null;
        return "Spiel beendet, bis zum nächsten mal.";
    }


    function walkToEast(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[3] != null) {
            printOutput("Du läufst nach Osten");
            let roomInNorth: string = currentRoom.neighbour[3];
            // Durchlaufen des jsonConfigData Files
            for (let obj in jsonConfigData) {
                // Überprüfung, dass es ein Objekt der Obersten ebene ist
                if (jsonConfigData.hasOwnProperty(obj)) {
                    // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                    if (obj === roomInNorth) {
                        let theNewRoom: Room = new Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                        currentRoom = theNewRoom;
                        jsonConfigData.User.currentRoom = currentRoom;
                        printOutput(currentRoom.description);
                    }
                }
            }
        } else {
            printOutput("Hier ist kein Raum");
        }
    }


    function walkToWast(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[2] != null) {
            printOutput("Du läufst nach Westen");
            let roomInNorth: string = currentRoom.neighbour[2];
            // Durchlaufen des jsonConfigData Files
            for (let obj in jsonConfigData) {
                // Überprüfung, dass es ein Objekt der Obersten ebene ist
                if (jsonConfigData.hasOwnProperty(obj)) {
                    // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                    if (obj === roomInNorth) {
                        let theNewRoom: Room = new Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                        currentRoom = theNewRoom;
                        jsonConfigData.User.currentRoom = currentRoom;
                        printOutput(currentRoom.description);
                    }
                }
            }
        } else {
            printOutput("Hier ist kein Raum");
        }
    }

    function walkToSouth(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[1] != null) {
            printOutput("Du läufst nach Süden");
            let roomInNorth: string = currentRoom.neighbour[1];
            // Durchlaufen des jsonConfigData Files
            for (let obj in jsonConfigData) {
                // Überprüfung, dass es ein Objekt der Obersten ebene ist
                if (jsonConfigData.hasOwnProperty(obj)) {
                    // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                    if (obj === roomInNorth) {
                        let theNewRoom: Room = new Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                        currentRoom = theNewRoom;
                        jsonConfigData.User.currentRoom = currentRoom;
                        printOutput(currentRoom.description);
                    }
                }
            }
        } else {
            printOutput("Hier ist kein Raum");
        }
    }

    function walkToNorth(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[0] != null) {
            printOutput("Du läufst nach Norden");
            let roomInNorth: string = currentRoom.neighbour[0];
            // Durchlaufen des jsonConfigData Files
            for (let obj in jsonConfigData) {
                // Überprüfung, dass es ein Objekt der Obersten ebene ist
                if (jsonConfigData.hasOwnProperty(obj)) {
                    // Ist der Objektname der gleiche, wie im currentRoom angegeben wird dieses erstellt und als currentRoom gesetzt
                    if (obj === roomInNorth) {
                        let theNewRoom: Room = new Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                        currentRoom = theNewRoom;
                        jsonConfigData.User.currentRoom = currentRoom;
                        printOutput(currentRoom.description);
                    }
                }
            }
        } else {
            printOutput("Hier ist kein Raum");
        }
    }



    function outputCommands(): string {
        let output: string = "[n] | norden <br/> [s] | süden <br/> [o] | osten <br/> [w] | westen <br/> [u] | umschauen <br> [i] | Inventar öffnen <br/> [a] | Item ablegen <br/>";
        if (currentRoom.person.length != 0) {
            output = output + " [r] | reden <br/>";
            // for (let i = 0; i < currentRoom.person.length; i++) {
            //     if (currentRoom.person[i].instanceof(Police)) {

            //     }

            // }
        } else if (currentRoom.item.length != 0) {
            output = output + "[t] | Item nehmen <br/>";
        }
        output = output + "[q] | Spiel verlassen";
        return output;
    }

    function getUserInput(): void {
        let inputField: HTMLInputElement = document.getElementById("inputField") as HTMLInputElement;

        inputField.addEventListener("keyup", function (_event: KeyboardEvent): void {
            if (_event.key === "Enter") {
                let inputValue: string = inputField.value.toLowerCase();
                checkUsersChoice(inputValue);
                inputField.value = "";
            }
        });
    }

    function printOutput(_theOutputString: string): void {
        let divConsole: HTMLDivElement = document.getElementById("console") as HTMLDivElement;
        divConsole.innerHTML += _theOutputString + "<br/>" + "<hr>"; // Fuegt Inhalt in den Div-Console Container ein
        divConsole.scrollTop = divConsole.scrollHeight - divConsole.clientHeight;   // Nach jeder neuen Consolen Ausgabe nach unten Scrollen
    }
} 