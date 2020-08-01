namespace textAdventure {
    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Osten ein Raum existiert 
     */
    export function walkToEast(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[3] != null) {
            printOutput("Du läufst nach Osten.");
            let roomInEast: string = currentRoom.neighbour[3];
            createNewRoom(roomInEast);
        } else {
            printOutput("Nach Osten befindet sich kein Weg.");
        }
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Westen ein Raum existiert 
     */
    export function walkToWast(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[2] != null && currentRoom.neighbour[2] != "Polizeiwache") {
            printOutput("Du läufst nach Westen.");
            let roomInWest: string = currentRoom.neighbour[2];
            createNewRoom(roomInWest);
        } else if (currentRoom.neighbour[2] === "Polizeiwache") {
            printOutput(gameOver("<div class='game-Over'><b>Du wurdest in der Polizeiwache identifiziert und festgenommen.<br/> Das Spiel ist vorbei.</b></div>"));
        } else {
            printOutput("Nach Westen befindet sich kein Weg.");
        }
    }

    /**
     * Funktion Überpüft ob im aktuellen Raum in Richtung Süden ein Raum existiert 
     */
    export function walkToSouth(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[1] != null && currentRoom.neighbour[1] != "Baustelle" && currentRoom.neighbour[1] != "Bank") {
            printOutput("Du läufst nach Süden.");
            let roomInSouth: string = currentRoom.neighbour[1];
            createNewRoom(roomInSouth);
        } else if (currentRoom.neighbour[1] === "Bank") {
            printOutput(gameOver("<div class='game-Over'> <b>Du bist zurück zum Tatort gelaufen und wurdest von der Polizei geschnappt. <br/> Das Spiel ist vorbei.</b><div/>"));
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
    export function walkToNorth(): void {
        // überprüft, ob der currentRoom in Norden ein Raum besitzt
        if (currentRoom.neighbour[0] != null && currentRoom.neighbour[0] != "Baustelle" && currentRoom.neighbour[0] != "Garage") {
            printOutput("Du läufst nach Norden.");
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
}
