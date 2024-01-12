export const BerlinBezirkeLatLng: BezirkeLatLng = {
    charlottenburg: [52.500000, 13.300000],
    friedrichshain: [52.515306, 13.461612],
    lichtenberg: [52.532161, 13.511893],
    marzahn: [52.533333, 13.566667],
    mitte: [52.5200, 13.4050],
    neukoelln: [52.481150, 13.435350],
    pankow: [52.597637, 13.436374],
    reinickendorf: [52.583333, 13.333333],
    spandau: [52.533333, 13.200000],
    steglitz: [52.433333, 13.250000],
    tempelhof: [52.450000, 13.383333],
    treptow: [52.416667, 13.583333],
}

export interface BezirkeLatLng {
    [bezirk: string]: number[];
  }
