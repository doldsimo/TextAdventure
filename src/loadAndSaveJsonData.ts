namespace textAdventure {

    /**
     * Funktion Lädt Json-Datei
     */
    export async function loadJsonData(): Promise<void> {
        let content: JSONData = await load("data/allGameInformation.json");
        startProgram(content);
    }
    /**
     * Funktion Speichert die Json-Datei
     */
    export async function saveJsonData(_content: JSONData): Promise<void> {
        save(JSON.stringify(_content), "data/allGameInformation_New.json");
    }

    /**
     * Funktion lädt die JSON-Datei und gibt diese zurück 
     * 
     * @param _filename: String | Name der JSON-Datei, welche gealden werden soll
     * @return (json): JSONObject | Gibt die geladenen Json-Daten zurück
     */
    async function load(_filename: string): Promise<JSONData> {
        // console.log("Start fetch");

        let response: Response = await fetch(_filename);

        let text: string = await response.text();
        let json: JSONData = JSON.parse(text);
        // alternative: json = await response.json();

        // console.log("Done fetch");
        return (json);
    }

    export function save(_content: string, _filename: string): void {
        //JSON-Objekt in Text umwandeln
        let myJson: string = JSON.stringify(_content);
        console.log(_content.toString());
        console.log(myJson);
        console.log(_content);
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