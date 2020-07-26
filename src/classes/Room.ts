namespace textAdventure {

    export class Room {
        name: string;
        description: string;
        police: Police[];
        passanger: Passanger[];
        salesman: Salesman[];
        person: Person[];
        item: Item[];
        neighbour: string[];


        constructor(_name: string, _description: string, _police: Police[], _passanger: Passanger[], _salesman: Salesman[], _item: Item[], _neigbour: string[]) {
            this.name = _name;
            this.description = _description;
            this.police = this.createPolice(_police);
            this.passanger = this.createPassanger(_passanger);
            this.salesman = this.createSalesman(_salesman);
            this.item = this.buildingItems(_item);
            this.neighbour = _neigbour;
            this.person = this.addAllPersons();
        }

        private createPolice(_police: Police[]): Police[] {
            let allPolice: Police[] = [];
            for (let i: number = 0; i < _police.length; i++) {
                let thePliceman: Police = new Police(_police[i].name, _police[i].text, _police[i].life, _police[i].item);
                allPolice.push(thePliceman);
            }
            return allPolice;
        }

        private createPassanger(_passanger: Passanger[]): Passanger[] {
            let allPassanger: Passanger[] = [];
            for (let i: number = 0; i < _passanger.length; i++) {
                let thePassanger: Passanger = new Passanger(_passanger[i].name, _passanger[i].text, _passanger[i].text2);
                allPassanger.push(thePassanger);
            }
            return allPassanger;

        }

        private createSalesman(_salesman: Salesman[]): Salesman[] {
            let allSalesman: Salesman[] = [];
            for (let i: number = 0; i < _salesman.length; i++) {
                let theSalesman: Salesman = new Salesman(_salesman[i].name, _salesman[i].text, _salesman[i].text2);
                allSalesman.push(theSalesman);
            }
            return allSalesman;
        }

        private addAllPersons(): Person[] {
            let allPersons: Person[] = [];
            for (let i: number = 0; i < this.police.length; i++) {
                allPersons.push(this.police[i]);
            }
            for (let i: number = 0; i < this.passanger.length; i++) {
                allPersons.push(this.passanger[i]);
            }
            for (let i: number = 0; i < this.salesman.length; i++) {
                allPersons.push(this.salesman[i]);
            }
            return allPersons;
        }


        /**
         * Erstellt alle Items welche sich im jeweiligen Raum befinden 
         * 
         * @param _item | Item Objekt
         * @return items | Array mit allen Items
         */
        private buildingItems(_item: Item[]): Item[] {
            let items: Item[] = [];
            for (let i: number = 0; i < _item.length; i++) {
                let theItem: Item = new Item(_item[i].name);
                items.push(theItem);
            }
            return items;
        }
    }


}


