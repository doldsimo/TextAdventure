namespace textAdventure {
    export class Building {
        name: string;
        description: string;
        person: Person[];
        item: Item[];
        neighbour: string[];

        constructor(_name: string, _description: string, _person: Person[], _item: Item[], _neigbour: string[]) {
            this.name = _name;
            this.description = _description;
            this.person = _person;
            this.item = this.buildingItems(_item);
            this.neighbour = _neigbour;
        }

        /* Erstellt alle Items welche sich im jeweiligen Raum befinden 
        @parm:      Item Objekte  
        @return:    Array von allen Items                                */
        private buildingItems(_item: Item[]): Item[] {
            let items: Item[] = [];
            for (let i: number = 0; i < _item.length; i++) {
                let theItem: Item = new Item(_item[i].name);
                items.push(theItem);
            }
            console.log(items);
            return items;
        }
    }


}


