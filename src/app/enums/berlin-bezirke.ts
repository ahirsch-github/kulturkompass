export const BerlinBezirke: Bezirke = {
    mitte: 'Mitte',
    charlottenburg: 'Charlottenburg',
    friedrichshain: 'Friedrichshain-Kreuzberg',
    lichtenberg: 'Lichtenberg',
    marzahn: 'Marzahn-Hellersdorf',
    neukoelln: 'Neukölln',
    pankow: 'Pankow',
    reinickendorf: 'Reinickendorf',
    spandau: 'Spandau',
    steglitz: 'Steglitz-Zehlendorf',
    tempelhof: 'Tempelhof-Schöneberg',
    treptow: 'Treptow-Köpenick',
}

export interface Bezirke {
    [bezirkName: string]: string;
  }