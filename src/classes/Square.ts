namespace textAdventure {
    export class Square {
        name: string;
        description: string;
        person: Person[];
        item: Item[];

        constructor(_name: string, _description: string, _person: Person[], _item: Item[], _neighbour: Building[] | Square[]) {
            this.name = _name;
            this.description = _description;
            this.person = _person;
            this.item = _item;
        }

    }
}

