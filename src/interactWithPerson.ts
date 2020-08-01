namespace textAdventure {

    export function attackPolice(): void {
        let output: string = "";
        // Überprüft, ob ein im aktuellen Raum ist
        if (currentRoom.police.length != 0) {
            output = output + "Welchen Polizisten möchtest du angreifen?";
            for (let i: number = 0; i < getAllPersonsFromCurrentRoom().length; i++) {
                if (getAllPersonsFromCurrentRoom()[i] instanceof Police) {
                    output = output + "<br/>" + "<b>[" + [i + 1] + "]</b>" + " Polizei | " + getAllPersonsFromCurrentRoom()[i].name;
                }
            }
            gameSequenz = 6;
            output = output + "<br/>Gebe die Nummer ein.";
        } else {
            output = output + "Hier befindet sich kein Polizist.";
            gameSequenz = 2;
        }
        printOutput(output);
        
    }

    export function attackThePickedPolice(_inNumber: number): void {
        let output: string = "";
        // Leben abziehen
        health = health - 40;
        // Leben in der JSON-Datei Abziehen
        jsonConfigData.User.health = health;
        // Überprüfen, des aktuellen Lebens (Wenn unter 0, ist das Spiel verloren)
        if (0 >= health) {
            printOutput(gameOver("<div class='game-Over'><b>Die Polizei hat im Kampf gegen dich gewonnen. Du hattest zu wenig Leben.<br/>Das Spiel ist vorbei.</b></div>"));
        } else {
            // Durläuft alle Personen im Aktuellen Raum
            for (let i: number = 0; i < getAllPersonsFromCurrentRoom().length; i++) {
                // Schaut, ob die Person ein Polizist ist
                if (getAllPersonsFromCurrentRoom()[i] instanceof Police) {
                    // Pickt sich den Polizist, welcher sich hinter der eingegebenen Nummer verbirgt
                    if (i === _inNumber - 1) {
                        output = output + "Du hast den Polizist " + getAllPersonsFromCurrentRoom()[i].name + " angegriffen.<br/> Dieser ist nun bewusstlos und hat seine Gegenstände verloren.<br/>Du hast 40% Leben verloren. Dein Gesundheitszustand beträgt nun " + health + "%.";
                    }
                }
            }
            // Hinzufügen der Items des Polizist zum currentRoom
            let attackedPoliceItemsArray: Item[] = jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].person.police[_inNumber - 1].item;
            for (let i: number = 0; i < attackedPoliceItemsArray.length; i++) {
                let theItem: Item = new Item(attackedPoliceItemsArray[i].name);
                // Item zum Aktuellen Raum hinzufügen
                currentRoom.item.push(theItem);
                // Item in der JSON-Datei hinzufügen
                jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].item.push(theItem);
            }
            // Entfernt den Polizisten aus der JSON-Datei
            jsonConfigData.Rooms[getIndexOfCurrentRoom(currentRoom)].person.police.splice(_inNumber - 1, _inNumber);
            // Entfernt des Polizisten aus dem aktuellen Raum
            currentRoom.police.splice(_inNumber - 1, _inNumber);
            printOutput(output);
            gameSequenz = 2;
        }
    }

    export function talkWithTheRightPerson(_inputNumber: number): void {
        for (let i: number = 0; i < getAllPersonsFromCurrentRoom().length; i++) {
            if (i === _inputNumber - 1) {
                if (getAllPersonsFromCurrentRoom()[i] instanceof Police) {
                    printOutput(getAllPolicemanFromCurrentRoom()[i].name + ": " + "<i>„" + getAllPolicemanFromCurrentRoom()[i].text + "“</i>");
                }
                if (getAllPersonsFromCurrentRoom()[i] instanceof Passanger) {
                    if ((Math.floor(Math.random() * Math.floor(2))) === 1) {
                        printOutput(getAllPassangerFromCurrentRoom()[i - getAllPolicemanFromCurrentRoom().length].name + ": " + "<i>„" + getAllPassangerFromCurrentRoom()[i - getAllPolicemanFromCurrentRoom().length].text + "“</i>");
                    } else {
                        printOutput(getAllPassangerFromCurrentRoom()[i - getAllPolicemanFromCurrentRoom().length].name + ": " + "<i>„" + getAllPassangerFromCurrentRoom()[i - getAllPolicemanFromCurrentRoom().length].text2 + "“</i>");
                    }
                }
                if (getAllPersonsFromCurrentRoom()[i] instanceof Salesman) {
                    if ((Math.floor(Math.random() * Math.floor(2))) === 1) {
                        printOutput(getAllSalesmanFromCurrentRoom()[i - (getAllPolicemanFromCurrentRoom().length + getAllPassangerFromCurrentRoom().length)].name + ": " + "<i>„" + getAllSalesmanFromCurrentRoom()[i - (getAllPolicemanFromCurrentRoom().length + getAllPassangerFromCurrentRoom().length)].text + "“</i>");
                    } else {
                        printOutput(getAllSalesmanFromCurrentRoom()[i - (getAllPolicemanFromCurrentRoom().length + getAllPassangerFromCurrentRoom().length)].name + ": " + "<i>„" + getAllSalesmanFromCurrentRoom()[i - (getAllPolicemanFromCurrentRoom().length + getAllPassangerFromCurrentRoom().length)].text2 + "“</i>");
                    }
                }
            }
        }
        gameSequenz = 2;
    }


    export function talkWithPerson(): void {
        let output: string = "";
        if (getAllPersonsFromCurrentRoom().length != 0) {
            output = output + "Mit wem möchtest du Reden?";
            for (let i: number = 0; i < getAllPersonsFromCurrentRoom().length; i++) {
                if (getAllPersonsFromCurrentRoom()[i] instanceof Police) {
                    output = output + "<br/>" + "<b>[" + [i + 1] + "]</b>" + " Polizei | " + getAllPersonsFromCurrentRoom()[i].name;
                }
                if (getAllPersonsFromCurrentRoom()[i] instanceof Passanger) {
                    output = output + "<br/>" + "<b>[" + [i + 1] + "]</b>" + " Passant | " + getAllPersonsFromCurrentRoom()[i].name;
                }
                if (getAllPersonsFromCurrentRoom()[i] instanceof Salesman) {
                    output = output + "<br/>" + "<b>[" + [i + 1] + "]</b>" + " Verkäufer | " + getAllPersonsFromCurrentRoom()[i].name;
                }
            }
        }
        output = output + "<br/>Gebe die Nummer ein.";
        printOutput(output);
        gameSequenz = 5;
    }


    function getAllPolicemanFromCurrentRoom(): Police[] {
        let allPoliceman: Police[] = [];
        for (let i: number = 0; i < currentRoom.police.length; i++) {
            allPoliceman.push(currentRoom.police[i]);
        }
        return allPoliceman;
    }
    function getAllPassangerFromCurrentRoom(): Passanger[] {
        let allPassanger: Passanger[] = [];
        for (let i: number = 0; i < currentRoom.passanger.length; i++) {
            allPassanger.push(currentRoom.passanger[i]);
        }
        return allPassanger;
    }
    function getAllSalesmanFromCurrentRoom(): Salesman[] {
        let allSalesman: Salesman[] = [];
        for (let i: number = 0; i < currentRoom.salesman.length; i++) {
            allSalesman.push(currentRoom.salesman[i]);
        }
        return allSalesman;
    }
}