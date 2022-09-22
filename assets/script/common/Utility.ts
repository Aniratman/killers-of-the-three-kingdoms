export namespace Utility {
    export function swapValue<T extends Object>(left: T, right: T) {
        const temp = left;
        left = right;
        right = temp;
    }

    export function indexOf<T>(array: Array<T>, predicate: T | ((v: T) => boolean)) {
        let index: number = -1;
        const isFunction = predicate instanceof Function;
        for (let i = 0; i < array.length; ++i) {
            if (isFunction && predicate(array[i])) {
                index = i;
                break;
            } else if (predicate === array[i]) {
                index = i;
                break;
            }
        }
        return index;
    }
}
