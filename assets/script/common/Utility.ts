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

    /**
     * 截取数组，不进行深拷贝
     * @param change 是否改变原数组
     */
    export function slice<T>(array: Array<T>, start?: number, end?: number, change: boolean = false) {
        const ret: Array<T> = [];
        const l = start || 0;
        const r = end || array.length;
        for (let i = l; i < r; i++) {
            ret.push(array[i]);
        }
        if (change) {
            const temp: Array<T> = [];
            for (let i = 0; i < l; i++) {
                temp.push(array[i]);
            }
            for (let i = r; r < array.length; i++) {
                temp.push(array[i]);
            }
            array = temp;
        }
        return ret;
    }
}
