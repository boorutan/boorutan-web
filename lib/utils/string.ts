export function replaceXwithY(str: string, X: string, Y: string) {
    let regex = new RegExp(`(^|\\s)${X}(\\s|$)`, 'g');
    return str.replace(regex, Y);
}