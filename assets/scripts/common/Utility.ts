export namespace Utility {
    export function swapValue<T extends Object>(left: T, right: T) {
        const temp = left;
        left = right;
        right = temp;
        return [left, right];
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
            array.splice(0, array.length);
            while (temp.length) {
                array.push(temp.pop());
            }
        }
        return ret;
    }

    /**
     * C语言下的字符串格式
     * @param pattern
     * @param args
     * @returns
     */
    export function format(pattern: string, ...args) {
        pattern = pattern.replace(/%%/g, '%');
        const matchs = pattern.match(/(%[a-z.\d]+)/g) || [];
        if (matchs.length !== args.length) {
            console.error('params are not match patterns');
        }
        matchs.forEach((match, index) => {
            pattern = pattern.replace(match, (subStr: string) => {
                let param = args[index];
                if (subStr === '%d') {
                    return `${Math.floor(param)}`;
                }
                if (subStr === '%f') {
                    return param;
                }
                if (/^%0\d+d$/.test(subStr)) {
                    const count = Number(subStr.slice(2, subStr.length - 1)) || 0;
                    param = Math.floor(Number(param) || 0);
                    const diff = param.toString().length - count;
                    if (diff >= 0) {
                        return `${Math.floor(param)}`;
                    }

                    let s = '';
                    for (let i = 0; i < Math.abs(diff); ++i) {
                        s += '0';
                    }
                    return s + Math.floor(param);
                }
                if (/^%[.\d]+f$/.test(subStr)) {
                    const idxDot = subStr.indexOf('.');
                    if (idxDot >= 0) {
                        const count = Number(subStr.slice(idxDot + 1, subStr.length - 1)) || 0;
                        return param.toFixed(count);
                    }

                    const count = Number(subStr.slice(1, subStr.length - 1)) || 0;
                    return param.toFixed(count);
                }
                return param;
            });
        });
        return pattern;
    }
}
