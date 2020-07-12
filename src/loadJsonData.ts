namespace textAdventure {

    load("data/crossroads/allCrossroads.json").then();

    async function load(_path: string): Promise<void> {
        let response: Response = await fetch(_path);
        // tslint:disable-next-line: no-any
        let json: any = await response.json();
        console.log(json);
    }
} 