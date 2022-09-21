export default class GeneratorStack<TYiled, TReturn, TNext> {
    private __stack: Generator<TYiled, TReturn, TNext>[] = null;

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
            return { done: true, value: null } as IteratorResult<TYiled, TReturn>;
        }
        const iterResult = this.__stack[this.__stack.length - 1].next(param);
        if (iterResult.done) {
            this.__stack.pop();
        }
        return iterResult;
    }
}
