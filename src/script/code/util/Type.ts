// import {Procedure} from "./../Procedure";
// import {Quantity} from "./../Quantity";
// import {Unit} from "./../Unit";

// export type Name = "Any" | "Bool" | "List" | "Map" | "Procedure" | "Quantity" | "Text" | "Unit";

// export function union(type: Name | Name[], otherType: Name | Name[]): Name[] {
//     let result = ((Array.isArray(type)) ? type : [type]);

//     if (Array.isArray(otherType)) {
//         result.concat(otherType);
//     }
//     else {
//         result.push(otherType);
//     }

//     return result;
// }

// export function contains(type: Name | Name[], necessaryType: Name): boolean {
//     if (Array.isArray(type)) {
//         return (type as Name[]).some((currentType) => is(currentType, necessaryType));
//     }

//     return type === necessaryType;
// }

// export function containsOf(type: Name | Name[], value: any): boolean {
//     return contains(type, of(value));
// }

// export function is(type: Name | Name[], necessaryType: Name | Name[]): boolean {
//     if (Array.isArray(type)) {
//         return (type as Name[]).every((currentType) => is(currentType, necessaryType));
//     }

//     if (Array.isArray(necessaryType)) {
//         return (necessaryType as Name[]).every((currentNecessaryType) => is(type, currentNecessaryType));
//     }

//     return (type === "Any") || (type === necessaryType);
// }

// export function isOf(type: Name | Name[], value: any): boolean {
//     return is(type, of(value));
// }

// export function of(value: any): Name {
//     if (!isOfAny(value)) {
//         return "Any";
//     }

//     if (isOfBool(value)) {
//         return "Bool";
//     }

//     if (isOfList(value)) {
//         return "List";
//     }

//     if (isOfProcedure(value)) {
//         return "Procedure";
//     }

//     if (isOfQuantity(value)) {
//         return "Quantity";
//     }

//     if (isOfText(value)) {
//         return "Text";
//     }

//     if (isOfUnit(value)) {
//         return "Unit";
//     }

//     if (isOfMap(value)) {
//         return "Map";
//     }

//     throw new Error(`Undefined type: ${value} (${typeof value})`);
// }

// // function isAssignable(type: Name | Name[], value: any): boolean {
// //     if (Array.isArray(type)) {
// //         for (let currentType of type) {
// //             if (isAssignable(type, value)) {
// //                 return true;
// //             }
// //         }

// //         return false;
// //     }

// //     switch (name) {
// //         case "Bool":
// //             return isBool(value);

// //         case "List":
// //             return isList(value);

// //         case "Map":
// //             return isMap(value);

// //         case "Procedure":
// //             return isProcedure(value);

// //         case "Quantity":
// //             return isQuantity(value);

// //         case "Text":
// //             return isText(value);

// //         case "Unit":
// //             return isUnit(value);

// //         default:
// //             throw new Error(`Unsupported type name: ${name}`);
// //     }
// // }

// export function isOfAny(value: any) {
//     return (value !== undefined) && (value !== null);
// }

// export function isOfBool(value: any) {
//     return typeof value === "boolean";
// }

// export function isOfList(value: any) {
//     return Array.isArray(value);
// }

// export function isOfMap(value: any) {
//     return (value instanceof Object) && (!isOfList(value)) && (!isOfProcedure(value)) && (!isOfQuantity(value)) && (!isOfUnit(value));
// }

// export function isOfProcedure(value: any) {
//     return value instanceof Procedure;
// }

// export function isOfQuantity(value: any) {
//     return value instanceof Quantity;
// }

// export function isOfText(value: any) {
//     return typeof value === "string";
// }

// export function isOfUnit(value: any) {
//     return value instanceof Unit;
// }
