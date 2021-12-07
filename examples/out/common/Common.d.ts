export declare function createCanvas(x?: number, y?: number, width?: number, height?: number): HTMLCanvasElement;
/**
 * 清理画布
 * @param canvas 画布
 */
export declare function clearCanvas(canvas: HTMLCanvasElement, fillStyle?: string): void;
/**
 * 绘制曲线
 * @param canvas 画布
 * @param points 曲线上的点
 * @param strokeStyle 曲线颜色
 */
export declare function drawPointsCurve(canvas: HTMLCanvasElement, xpoints: number[], ypoints: number[], strokeStyle?: string, lineWidth?: number): void;
export declare function drawBezierCurve(canvas: HTMLCanvasElement, xpoints: number[], ypoints: number[], strokeStyle?: string, lineWidth?: number): void;
export declare const ColorKeywords: {
    aliceblue: number;
    antiquewhite: number;
    aqua: number;
    aquamarine: number;
    azure: number;
    beige: number;
    bisque: number;
    black: number;
    blanchedalmond: number;
    blue: number;
    blueviolet: number;
    brown: number;
    burlywood: number;
    cadetblue: number;
    chartreuse: number;
    chocolate: number;
    coral: number;
    cornflowerblue: number;
    cornsilk: number;
    crimson: number;
    cyan: number;
    darkblue: number;
    darkcyan: number;
    darkgoldenrod: number;
    darkgray: number;
    darkgreen: number;
    darkgrey: number;
    darkkhaki: number;
    darkmagenta: number;
    darkolivegreen: number;
    darkorange: number;
    darkorchid: number;
    darkred: number;
    darksalmon: number;
    darkseagreen: number;
    darkslateblue: number;
    darkslategray: number;
    darkslategrey: number;
    darkturquoise: number;
    darkviolet: number;
    deeppink: number;
    deepskyblue: number;
    dimgray: number;
    dimgrey: number;
    dodgerblue: number;
    firebrick: number;
    floralwhite: number;
    forestgreen: number;
    fuchsia: number;
    gainsboro: number;
    ghostwhite: number;
    gold: number;
    goldenrod: number;
    gray: number;
    green: number;
    greenyellow: number;
    grey: number;
    honeydew: number;
    hotpink: number;
    indianred: number;
    indigo: number;
    ivory: number;
    khaki: number;
    lavender: number;
    lavenderblush: number;
    lawngreen: number;
    lemonchiffon: number;
    lightblue: number;
    lightcoral: number;
    lightcyan: number;
    lightgoldenrodyellow: number;
    lightgray: number;
    lightgreen: number;
    lightgrey: number;
    lightpink: number;
    lightsalmon: number;
    lightseagreen: number;
    lightskyblue: number;
    lightslategray: number;
    lightslategrey: number;
    lightsteelblue: number;
    lightyellow: number;
    lime: number;
    limegreen: number;
    linen: number;
    magenta: number;
    maroon: number;
    mediumaquamarine: number;
    mediumblue: number;
    mediumorchid: number;
    mediumpurple: number;
    mediumseagreen: number;
    mediumslateblue: number;
    mediumspringgreen: number;
    mediumturquoise: number;
    mediumvioletred: number;
    midnightblue: number;
    mintcream: number;
    mistyrose: number;
    moccasin: number;
    navajowhite: number;
    navy: number;
    oldlace: number;
    olive: number;
    olivedrab: number;
    orange: number;
    orangered: number;
    orchid: number;
    palegoldenrod: number;
    palegreen: number;
    paleturquoise: number;
    palevioletred: number;
    papayawhip: number;
    peachpuff: number;
    peru: number;
    pink: number;
    plum: number;
    powderblue: number;
    purple: number;
    rebeccapurple: number;
    red: number;
    rosybrown: number;
    royalblue: number;
    saddlebrown: number;
    salmon: number;
    sandybrown: number;
    seagreen: number;
    seashell: number;
    sienna: number;
    silver: number;
    skyblue: number;
    slateblue: number;
    slategray: number;
    slategrey: number;
    snow: number;
    springgreen: number;
    steelblue: number;
    tan: number;
    teal: number;
    thistle: number;
    tomato: number;
    turquoise: number;
    violet: number;
    wheat: number;
    white: number;
    whitesmoke: number;
    yellow: number;
    yellowgreen: number;
};
export declare function getColors(num: number): any[];
/**
 * 绘制点
 * @param canvas 画布
 * @param xpoints 曲线上的点x坐标
 * @param ypoints 曲线上的点y坐标
 * @param fillStyle 曲线颜色
 */
export declare function drawPoints(canvas: HTMLCanvasElement, xpoints: number[], ypoints: number[], fillStyle?: string, lineWidth?: number): void;
