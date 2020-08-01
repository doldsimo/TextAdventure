namespace textAdventure {
    /**
     * Funktion Lädt Json-Datei
     */
    export async function startloadJsonData(): Promise<void> {
        let content: JSONData = await load("data/allGameInformation.json");
        startProgram(content);
    }
    /**
     * Funktion lädt die JSON-Datei und gibt diese zurück 
     * 
     * @param _filename: String | Name der JSON-Datei, welche gealden werden soll
     * @return (json): JSONObject | Gibt die geladenen Json-Daten zurück
     */
    async function load(_filename: string): Promise<JSONData> {
        let response: Response = await fetch(_filename);
        let text: string = await response.text();
        let json: JSONData = JSON.parse(text);
        return (json);
    }
    export function loadUsersJSONData(): void {
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
                console.log(jsonConfigData);
                startProgram(jsonConfigData);
            };
            fr.readAsText(this.files[0]);
        });
    }

    export function saveGame(): void {
        //Aktuelles Inventar wird in die JSON-Datei geschrieben
        jsonConfigData.User.item = inventory;
        //Current Room wird festgelegt
        jsonConfigData.User.currentRoom = currentRoom.name;
        //Aktueller Lebensstand wird in die JSON-Datei geschrieben
        jsonConfigData.User.health = health;
        printOutput("Das Spiel wird gespeichert. Schaue in deinen Downloads Ordner.");
        save(jsonConfigData, "gameData");
    }

    export function save(_content: JSONData, _filename: string): void {
        //JSON-Objekt in Text umwandeln
        let myJson: string = JSON.stringify(_content);
        let blob: Blob = new Blob([myJson], { type: "application/json" });
        let url: string = window.URL.createObjectURL(blob);
        //*/ using anchor element for download
        let downloader: HTMLAnchorElement;
        downloader = document.createElement("a");
        downloader.setAttribute("href", url);
        downloader.setAttribute("download", _filename);
        document.body.appendChild(downloader);
        downloader.click();
        document.body.removeChild(downloader);
        window.URL.revokeObjectURL(url);
    }
} 