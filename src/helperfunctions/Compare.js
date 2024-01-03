export function compare(a, b) {

    // Udviklet fælles i gruppen
    // Bruges til at sortere fx. ingredienser når man opretter et nyt produkt

    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
}
