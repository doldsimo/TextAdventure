namespace textAdventure {
    checkUserInput();

    function checkUserInput(): void {
        let inputField: HTMLInputElement = document.getElementById("inputField") as HTMLInputElement;
        // tslint:disable-next-line: typedef
        inputField.addEventListener("keyup", function (_event) {
            if (_event.key === "Enter") {
                printOutput(inputField.value);
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