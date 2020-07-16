namespace textAdventure {
    let gameSequenz: number = 0;
    let gameContent: any = [];

    // let Persons: Person[] = [];

    loadJsonData();

    export function startProgram(_content: JSONObject): void {
        gameContent = _content;
        console.log(_content);
        printOutput("Zum Starten des Spieles, gebe „start“ ein.");
        getUserInput();
        // saveJsonData(_content);
    }

    function checkUsersChoice(_userInput: string): void {
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
            gameContent.User.name = _userInput;
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
                printOutput("Du befindest dich in der Bank und hast gerade den Schalter überfallen, flüchte so schnell wie möglich!");
                // tslint:disable-next-line: align
            }, 2800);
            let bank: Building = new Building(gameContent.Bank.name, gameContent.Bank.description, gameContent.Bank.person, gameContent.Bank.item, gameContent.Bank.neighbour);
            console.log(bank);

        } else if (gameSequenz === 2) {

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