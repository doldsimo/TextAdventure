
namespace textAdventure {
    export let gameSequenz: number = 0; // Spiel Sequenz in welcher sich der Spieler befindet
    export let jsonConfigData: JSONData; // Json Datei

    export let currentRoom: Room; // Akuteller Raum 
    let money: Item; // Akutelles Geld
    export let inventory: Item[] = []; // Inventar 
    export let health: number; // Lebensanzeige

    startloadJsonData();

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
        if (gameSequenz === 0) {
            printOutput("Willkommen bei ESCAPE. <br/> Starte ein neues Spiel mit „start“. <br/>Lade einen Spielstand mit „load“.");
            //Fuege das Geld der JSON Datei in die Money Variable und ins Inventar ein
            money = new Item(jsonConfigData.User.item[0].name);
            inventory.push(money);
        } else {
            // Erstellen des gespeicherten Raums
            createNewRoom(jsonConfigData.User.currentRoom);
            // Setzen des gespeicherten Lebens
            health = jsonConfigData.User.health;
            // Setzen des Inventars
            inventory = jsonConfigData.User.item;
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
                        printOutput(showLife());
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
                    case "beenden":
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
                let userInputAsNumber: number = +_userInput;
                if (Number.isInteger(userInputAsNumber) && _userInput != "") {
                    pullItemFromRoomAndPushToInventory(userInputAsNumber);
                } else {
                    printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                }
                break;
            // Item Ablegen
            case 4:
                let inputAsNumber: number = +_userInput;
                if (Number.isInteger(inputAsNumber) && _userInput != "") {
                    pullItemFromInventoryAndPushToRoom(inputAsNumber);
                } else {
                    printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                }
                break;
            // Mit Person reden
            case 5:
                let inputNumber: number = +_userInput;
                if (Number.isInteger(inputNumber) && _userInput != "") {
                    talkWithTheRightPerson(inputNumber);
                } else {
                    printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                }
                break;
            // Polizei angreifen
            case 6:
                let inNumber: number = +_userInput;
                if (Number.isInteger(inNumber) && _userInput != "") {
                    attackThePickedPolice(inNumber);
                } else {
                    printOutput("„" + _userInput + "“ ist eine ungekannte Eingabe.");
                }
                break;
            default:
                break;
        }
    }

    export function getIndexOfCurrentRoom(_currentRom: Room): number {
        let index: number;
        for (let i: number = 0; i < jsonConfigData.Rooms.length; i++) {
            if (_currentRom.name === jsonConfigData.Rooms[i].name) {
                index = i;
            }
        }
        return index;
    }

    function startGameRegulary(_userInput: string): void {
        // Setzt Spielername in der JSON-Datei
        jsonConfigData.User.name = _userInput;
        gameSequenz++;
        printOutput("Hallo " + _userInput.toUpperCase() + ", das Spiel startet in:");
        let timerNumber: number = 3;
        let refreshIntervalId: number = setInterval(function (): void {
            if (timerNumber < 2)
                clearInterval(refreshIntervalId);
            printOutput("<p class='red'>" + timerNumber.toString() + "<p/>");
            timerNumber--;
            // tslint:disable-next-line: align
        }, 700);
        setTimeout(function (): void {
            let output: string = "<b class='blue'>Du befindest dich in der Bank und hast gerade den Schalter überfallen und dabei 20000 Euro erbeutet. Flüchte so schnell wie möglich!</b> <br/> <b>[h]</b> | Hilfe";
            printOutput(output);
            // tslint:disable-next-line: align
        }, 2800);
        // Setzt den Anfangsraum fest
        let bank: Room = new Room(jsonConfigData.Rooms[0].name, jsonConfigData.Rooms[0].description, jsonConfigData.Rooms[0].person.police, jsonConfigData.Rooms[0].person.passanger, jsonConfigData.Rooms[0].person.salesman, jsonConfigData.Rooms[0].item, jsonConfigData.Rooms[0].neighbour);
        currentRoom = bank;
        // Setzt das Anfangsleben fest
        health = jsonConfigData.User.health;
    }

    function outputPersonsInRoom(): string {
        let output: string = "";
        if (getAllPersonsFromCurrentRoom().length != 0) {
            output = output + "Hier befinden sich folgende Personen:";
            for (let i: number = 0; i < getAllPersonsFromCurrentRoom().length; i++) {
                if (getAllPersonsFromCurrentRoom()[i] instanceof Police) {
                    output = output + "<br/> Polizei | " + getAllPersonsFromCurrentRoom()[i].name;
                }
                if (getAllPersonsFromCurrentRoom()[i] instanceof Passanger) {
                    output = output + "<br/> Passant | " + getAllPersonsFromCurrentRoom()[i].name;
                }
                if (getAllPersonsFromCurrentRoom()[i] instanceof Salesman) {
                    output = output + "<br/> Verkäufer | " + getAllPersonsFromCurrentRoom()[i].name;
                }
            }
        } else {
            output = output + "Hier befinden sich keine Personen.";

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
            output = output + "Hier befinden sich keine Gegenstände.";
        }
        return output;
    }

    /**
     * Funktion erzeugt ein neues Raum-Objekt, welche anschließend in der "currentRoom" variable gespeichert wird
     * 
     * @param _nameOfNewRoom: String | Name des Raumes in welchen man navigieren möchte
     */
    export function createNewRoom(_nameOfNewRoom: string): void {
        for (let i: number = 0; i < jsonConfigData.Rooms.length; i++) {
            if (_nameOfNewRoom === jsonConfigData.Rooms[i].name) {
                let theNewRoom: Room = new Room(jsonConfigData.Rooms[i].name, jsonConfigData.Rooms[i].description, jsonConfigData.Rooms[i].person.police, jsonConfigData.Rooms[i].person.passanger, jsonConfigData.Rooms[i].person.salesman, jsonConfigData.Rooms[i].item, jsonConfigData.Rooms[i].neighbour);
                currentRoom = theNewRoom;
                jsonConfigData.User.currentRoom = currentRoom.name;
                printOutput("<b class='blue'>" + currentRoom.description + "</b><br/> <b>[h]</b> | Hilfe");
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
        if (getAllPersonsFromCurrentRoom().length != 0) {
            output = output + " <b>[r]</b> | reden <br/>";
        }
        if (currentRoom.item.length != 0) {
            output = output + "<b>[t]</b> | Item nehmen <br/>";
        }
        if (inventory.length > 0) {
            output = output + "<b>[a]</b> | Item ablegen <br/>";
        }
        let firstTime: boolean = true;
        for (let i: number = 0; i < getAllPersonsFromCurrentRoom().length; i++) {
            if (getAllPersonsFromCurrentRoom()[i] instanceof Police && firstTime) {
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
    export function getAllPersonsFromCurrentRoom(): Person[] {
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

    export function gameWin(): string {
        gameSequenz = null;
        let gameWinText: string = "Herzlichen Glückwunsch " + jsonConfigData.User.name.toUpperCase() + ". Du hast gewonnen!<br/>Die Polizei hat dich nicht geschnappt und du hast einen Unterschlupf gefunden,<br/>in dem du dich verstecken kannst! <br/> <br/>";
        // Überprüft, ob überhaupt Geld im Inventar ist
        if (!((new RegExp(" Euro")).test(inventory[0].name))) {
            gameWinText = gameWinText + "Leider hast du kein Geld erbeutet.";
        }
        // Überprüft wie viel Geld im Inventar ist und gibt jenachem unterschiedliche ausgaben aus
        if ((new RegExp(" Euro")).test(inventory[0].name)) {
            gameWinText = gameWinText + "Du hast " + inventory[0].name + " von maximal 40000 Euro erbeutet. <br/>";
            let money: number = +inventory[0].name.split(" ")[0];
            if (money === 40000)
                gameWinText = gameWinText + "In der Garage befindet sich dein Komplize Jonny mit dem Fluchtfahrzeug. Ihr kommt ungesehen aus der Stadt und flüchtet nach Russland. Du lässt dein kriminelles Leben hinter dir und beginnst ein neues Leben auf einer Insel im pazifischen Ozean.";
            else if (money > 39000)
                gameWinText = gameWinText + "Du schnappst dir ein Fahrrad aus der Garage und flüchtest aus der Stadt zu deiner Familie. Du kannst ihr mit dem Geld nun endlich das Leben ermöglichen, das du immer wolltest.";
            else if (money > 30000)
                gameWinText = gameWinText + "Du ziehst dich in der Garage um und flüchtest unbemerkt durch die Hintertür. Du lebst dein Leben normal in einer entfernten Stadt weiter. Fünf Jahre später wurde der Fall neu aufgerollt. Durch deine DNA-Spuren an der Kleidung konntest du überführt werden. Es drohen dir nun 5 Jahre Haft.";
            else if (money > 21000)
                gameWinText = gameWinText + "Du flüchtest erfolgreich mit einem kleinen VW-Polo aus der Stadt. Du bist überwältigt, wie schnell du eine Bank überfallen hast. In deinem Kopf planst du bereits den nächsten Überfall auf die Zentralbank.";
            else if (money >= 20000)
                gameWinText = gameWinText + "Mit einem Fluchtfahrzeug in der Garage fährst du direkt ins nächstgelegene Casino. Innerhalb von 24 Stunden hast du dein komplettes Geld verspielt, woraufhin du neue Überfälle planst.";
            else if (money > 5000)
                gameWinText = gameWinText + "Du hast die Beute der Bank unterwegs abgelegt. Die Polizei fand daran Fingerabdrücke und konnte dich mit Hilfe eines Phantombildes identifizieren. Du wurdest zu 7 Jahren Haft verurteilt.";
            else if (money > 0)
                gameWinText = gameWinText + "Dein Komplize Jessy ist außer sich vor Wut über die geringe Ausbeute. Er lässt dich alleine in der Garage zurück. Du lässt dein kriminelles Leben hinter dir und kaufst dir vom Geld eine Kugel Eis. ";
            else if (money === 0)
                gameWinText = gameWinText + "Du hast leider kein Geld erbeutet. Während der Flucht hast du bemerkt, dass Geld nicht alles ist. Du bist froh, dass du den Polizisten entwischt bist und deine Freiheit hast.";
        }
        return "<div class='game-Win'><b>" + gameWinText + "</b><div>";
    }

    export function gameOver(_gameOverText: string): string {
        gameSequenz = null;
        return _gameOverText;
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
        return "Spiel beendet, bis zum nächsten Mal.";
    }

    /**
    * Funktion git den Aktuellen Lebenszustand des Spielers zurück
    * 
    * @return: string | Lebenszustand des Spielers
    */
    function showLife(): string {
        return "Dein aktueller Gesundheitszustand ist: " + health + "%";
    }

    /**
     * Funktion fuegt den übergebenen String dem HTML-Dokument hinzu
     * 
     * @param _theOutputString: String | String welcher ausgegeben werden soll
     */
    export function printOutput(_theOutputString: string): void {
        let divConsole: HTMLDivElement = document.getElementById("console") as HTMLDivElement;
        divConsole.innerHTML += _theOutputString + "<br/>" + "<hr>"; // Fuegt Inhalt in den Div-Console Container ein
        divConsole.scrollTop = divConsole.scrollHeight - divConsole.clientHeight;   // Nach jeder neuen Consolen Ausgabe nach unten Scrollen
    }
}