namespace textAdventure {

    /**
     * Funktion Lädt Json-Datei
     */
    export async function loadJsonData(): Promise<void> {
        let content: JSONObject = await load("data/crossroads/allCrossroads.json");
        startProgram(content);
    }
    /**
     * Funktion Speichert die Json-Datei
     */
    export async function saveJsonData(_content: JSONObject): Promise<void> {
        save(JSON.stringify(_content), "data/crossroads/allCrossroads_New.json");
    }

    /**
     * Funktion lädt die JSON-Datei und gibt diese zurück 
     * 
     * @param _filename: String | Name der JSON-Datei, welche gealden werden soll
     * @return (json): JSONObject | Gibt die geladenen Json-Daten zurück
     */
    async function load(_filename: string): Promise<JSONObject> {
        // console.log("Start fetch");

        let response: Response = await fetch(_filename);

        let text: string = await response.text();
        let json: JSONObject = JSON.parse(text);
        // alternative: json = await response.json();

        // console.log("Done fetch");
        return (json);
    }

    function save(_content: string, _filename: string): void {
        let blob: Blob = new Blob([_content], { type: "text/plain" });
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