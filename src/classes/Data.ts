namespace textAdventure {
    // Klasse um die Json Daten zu laden und zu Speichern
    export type JSONPrimitive = string | number | boolean | null;
    export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
    // export type JSONObject = { [member: string]: JSONValue };
    export interface JSONArray extends Array<JSONValue> { }
    export type JSONObject = { [key: string]: JSON };


    export interface JSONData {
        User: UserInformation;
        Rooms: DataRoom[];
    }

    export interface UserInformation {
        name: string;
        item: Item[];
        currentRoom: string;
        health: number;
    }

    export interface DataRoom {
        name: string;
        description: string;
        person: Personen;
        item: Item[];
        neighbour: string[];
    }

    export interface Personen {
        polizei: Polizei[];
        passant: Passant[];
        verkaeufer: Verkaeufer[];
    }


    export interface Polizei {
        name: string;
        text: string;
        life: number;
        item: Item[];
    }

    export interface Passant {
        name: string;
        text: string;
        text2: string;
    }

    export interface Verkaeufer {
        name: string;
        text: string;
        text2: string;
    }

}