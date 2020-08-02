namespace textAdventure {
    /**
     * Funktion nimmt das Item aus dem Inventar und pusht es in den aktuellen Raum
     * 
     * @param _inputAsNumber: number | nummer des zu entfernenden Item
     */
    export function pullItemFromInventoryAndPushToRoom(_inputAsNumber: number): void {
        for (let i: number = 0; i < inventory.length; i++) {
            if (i === _inputAsNumber - 1) {
                let item: Item = inventory.splice(_inputAsNumber - 1, 1)[0];
                jsonConfigData.User.item.splice(_inputAsNumber - 1, 1);
                // Fügt das Item im akutellen Raum in die JSON-Datei ein
                jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].item.push(item);
                currentRoom.item.push(item);
                printOutput("<p class='red'>&nbsp;- " + item.name + " abgelegt <p/>");
            }
        }
        gameSequenz = 2;
    }

    /**
     * Funktion gibt die Moeglickeiten an, welche Items abgelegt werden koennen
     * 
     */
    export function dropItem(): void {
        let output: string = "";
        // Überprüfung, ob sich im Items im Inventar befinden
        if (inventory.length != 0) {
            output = output + "Folgende Gegenstände hast du im Inventar";
            for (let i: number = 0; i < inventory.length; i++) {
                output = output + "<br/>" + "<b>[" + [i + 1] + "]</b> " + inventory[i].name;
            }
            output = output + "<br/>Was möchtest du ablegen? <br/>Gebe die Nummer ein.";
            gameSequenz = 4;
        } else {
            output = output + "Du kannst nichts ablegen, da du keine Gegenstände im Inventar hast.";
        }
        printOutput(output);
    }

    /**
     * Funktion nimmt das Item aus dem aktuellen Raum und pusht es ins Inventar
     * 
     * @param _userInputAsNumber: number | nummer des zu entfernenden Item
     */
    export function pullItemFromRoomAndPushToInventory(_userInputAsNumber: number): void {
        for (let i: number = 0; i < currentRoom.item.length; i++) {
            if (i === _userInputAsNumber - 1) {
                // Nimmt das Item aus dem currentRoom heraus und speichert es in der Variable item
                let item: Item = currentRoom.item.splice(_userInputAsNumber - 1, 1)[0];
                // Löscht des Item aus der JSON-Datei
                jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].item.splice(_userInputAsNumber - 1, 1);
                let output: string = "";
                //Überprüft, ob das Item Geld ist, wenn ja wird es zusammenaddiert
                if ((new RegExp(" Euro")).test(item.name) || (new RegExp(" EURO")).test(item.name)) {

                    // Durchläuft das Akutelle Inventar
                    let oldInventoryLength: number = inventory.length;
                    let oldInventory: Item[] = inventory;
                    for (let i: number = 0; i < oldInventoryLength; i++) {
                        // Wenn sich  Geld im Inventar befindet 
                        if ((new RegExp(" Euro")).test(oldInventory[i].name)) {
                            let oldMoneyItem: Item = inventory.splice(i, 1)[i];
                            let oldMoney: number = +oldMoneyItem.name.split(" ")[0];

                            let pickedMoney: number = +item.name.split(" ")[0];

                            let newMoneyValue: number = oldMoney + pickedMoney;
                            let newMoney: Item = new Item(newMoneyValue + " Euro");

                            //Entfernen des Alten Geld Items
                            inventory.slice(i, 1);
                            //Hinzufügen des neuen Geld Items (mit neuem Geld wert)
                            inventory.unshift(newMoney);
                            break;
                        } else {
                            // Befindet sich noch kein Geld im Invantar oder Aktuelles Item ist kein Geld
                            inventory.unshift(item);
                            break;
                        }
                    }
                    if (inventory.length === 0) {
                        inventory.unshift(item);
                    }
                } else if (item.name === "Spritze") {
                    if (health + 50 < 100) {
                        health = health + 50;
                    } else {
                        health = 100;
                    }
                    output = output + "<br/>Leben um 50% geheilt. Dein Gesundheitszustand beträgt nun " + health + "%.";
                } else if (item.name === "Verband") {
                    if (health + 25 < 100) {
                        health = health + 25;
                    } else {
                        health = 100;
                    }
                    output = output + "<br/>Leben um 25% geheilt. Dein Gesundheitszustand beträgt nun " + health + "%.";
                } else if (item.name === "Hustensaft") {
                    if (health + 5 < 100) {
                        health = health + 5;
                    } else {
                        health = 100;
                    }
                    output = output + "<br/>Leben um 5% geheilt. Dein Gesundheitszustand beträgt nun " + health + "%.";
                } else {
                    // Pusth das erstellte Item ins Inventar (wennes keine Spritze, Verband oder Hustensaft ist)
                    inventory.push(item);
                }
                printOutput("<p class='green'>&nbsp;+ " + item.name + " aufgenommen<p/>" + output);
            }
        }
        gameSequenz = 2;
    }

    /**
     * Funktion gibt die Moeglickeiten an, welche Items aufgenommen werden koennen
     * 
     */
    export function takeItem(): void {
        let output: string = "";
        // Überprüfung, ob sich im Raum Items befinden
        if (currentRoom.item.length != 0) {
            output = output + "Hier befinden sich folgende Gegenstände:";
            for (let i: number = 0; i < currentRoom.item.length; i++) {
                output = output + "<br/>" + "<b>[" + [i + 1] + "]</b> " + currentRoom.item[i].name;
            }
            output = output + "<br/>Was möchtest du aufnehmen? <br/>Gebe die Nummer ein.";
            gameSequenz = 3;
        } else {
            output = output + "Du kannst nichts aufnehmen, da sich hier kein Gegenstände befinden.";
        }
        printOutput(output);
    }

    /**
     * Funktion gibt das aktuelle Inventar aus
     */
    export function outputInventory(): string {
        let output: string = "";
        if (inventory.length === 0) {
            output = output + "In deinem Inventar befinden sich keine Gegenstände.";
        } else {
            output = output + "In deinem Inventar befinden sich:";
            for (let i: number = 0; i < inventory.length; i++) {
                output = output + "<br/> - " + inventory[i].name;
            }
        }
        return output;
    }

}
