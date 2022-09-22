export interface GeneratorNextData<T> {
    data?: T;
    isOver?: boolean;
}

export default class GeneratorStack<TYiled, TReturn, TNext> {
    private __stack: Generator<TYiled, TReturn, TNext>[] = null;
    private __complete: boolean = false;

    constructor() {
        this.__stack = [];
    }

    push(generator: Generator<TYiled, TReturn, TNext>) {
        this.__stack.push(generator);
    }

    pop() {
        return this.__stack.pop();
    }

    top() {
        return this.__stack.length ? this.__stack[this.__stack.length - 1] : null;
    }

    next(param?: TNext) {
        if (!this.__stack.length) {
            this.__complete = true;
            return { done: true, value: null } as IteratorResult<TYiled, TReturn>;
        }
        this.__complete = false;
        const iterResult = this.__stack[this.__stack.length - 1].next(param);
        if (iterResult.done) {
            this.__stack.pop();
        }
        return iterResult;
    }

    isComplete() {
        return this.__complete;
    }
}
