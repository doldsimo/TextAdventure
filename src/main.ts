
namespace textAdventure {
    let gameSequenz: number = 0; // Spiel Sequenz in welcher sich der Spieler befindet
    let jsonConfigData: any = []; // Json Datei
    let currentRoom: Room; // Akuteller Raum 

    loadJsonData();

    /**
     * Funktion startet das Spiel
     * 
     * @param _content: JSONObject | Enthält alle Daten des Spieles
     */
    export function startProgram(_content: JSONObject): void {
        jsonConfigData = _content;
        if (gameSequenz === 0) {
            printOutput("Willkommen bei ESCAPE. <br/> Starte ein neues Spiel, gebe „start“. <br/> Laden einen Spielstand „load“.");
        } else {
            createNewRoom(jsonConfigData.User.currentRoom);
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
        // debugger;
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
                currentRoom = jsonConfigData.User.currentRoom;
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
                    case "q":
                        printOutput(quitGame());
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }


    function startGameRegulary(_userInput: string): void {
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


    /**
     * Funktion gibt den Beschreibungstext des aktuellen Raumes zurück
     * 
     * @return: String | Beschreibungstext des Raumes
     */
    function lookAroundRoom(): string {
        return currentRoom.description;
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
        if (currentRoom.neighbour[1] != null) {
            printOutput("Du läufst nach Süden");
            let roomInSouth: string = currentRoom.neighbour[1];
            createNewRoom(roomInSouth);
        } else {
            printOutput("In Süden befindet sich kein Raum");
        }
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Norden ein Raum existiert 
     */
    function walkToNorth(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[0] != null) {
            printOutput("Du läufst nach Norden");
            let roomInNorth: string = currentRoom.neighbour[0];
            createNewRoom(roomInNorth);
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
                    let theNewRoom: Room = new Room(jsonConfigData[obj].name, jsonConfigData[obj].description, jsonConfigData[obj].person, jsonConfigData[obj].item, jsonConfigData[obj].neighbour);
                    currentRoom = theNewRoom;
                    jsonConfigData.User.currentRoom = currentRoom;
                    printOutput(currentRoom.description);
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

    /**
     * Funktion löst Event aus, sobald der User etwas ins Input Feld eingegeben hat und mit Enter bestätigt hat
     */
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


