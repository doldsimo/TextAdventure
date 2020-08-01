namespace textAdventure {
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
        police: Police[];
        passanger: Passanger[];
        salesman: Salesman[];
    }
}