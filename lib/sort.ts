const _quickSort = <T>(arr: Array<any>, low: number, high: number, fn: (a: T, b: T)=> boolean = (a: T, b: T)=> a <= b) => {
    if (low < high) {
        let pivot = partition(arr, low, high, fn);
        _quickSort<T>(arr, low, pivot - 1, fn);
        _quickSort<T>(arr, pivot + 1, high, fn);
    }
}

function partition(arr: Array<any>, low: number, high: number, fn: any) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (fn(arr[j], pivot)) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}

function swap(arr: Array<any>, i: number, j: number) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

export const quickSort = <T>(arr: Array<T>, fn?: (a: T, b: T)=> boolean): Array<T> => {
    let array = arr.concat()
    _quickSort<T>(array, 0, array.length - 1, fn)
    return array
}