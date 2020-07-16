namespace textAdventure {
    
    export abstract class Person {
        name: string;
        text: string;

        constructor(_name: string, _text: string) {
            this.name = _name;
            this.text = _text;
        }

    }


    export class Passanger extends Person {
        name: string;
        text: string;
        text2: string;

        constructor(_name: string, _text: string, _text2: string) {
            super(_name, _text);
            this.text2 = _text;
        }

    }

    export class Salesman extends Person {
        name: string;
        text: string;
        text2: string;

        constructor(_name: string, _text: string, _text2: string) {
            super(_name, _text);
            this.text2 = _text;
        }

    }

    export class Police extends Person {
        name: string;
        text: string;
        life: number;
        item: Item[];


        constructor(_name: string, _text: string, _life: number, _item: Item[]) {
            super(_name, _text);
            this.life = _life;
            this.item = _item;
        }

    }
}

