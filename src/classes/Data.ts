namespace textAdventure {
    // Klasse um die Json Daten zu laden und zu Speichern
    export type JSONPrimitive = string | number | boolean | null;
    export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
    export type JSONObject = { [member: string]: JSONValue };
    export interface JSONArray extends Array<JSONValue> { }
}