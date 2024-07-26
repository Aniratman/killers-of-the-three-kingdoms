export interface GeneratorNextData<T> {
    data?: T;
    isOver?: boolean;
}

export default class GeneratorStack<TYiled, TReturn, TNext> {
    private __stack: Generator<TYiled, TReturn, TNext>[] = null;
    private __complete: boolean = false;
    private __responses: boolean[] = null;

    constructor() {
        this.__stack = [];
        this.__responses = [];
    }

    push(generator: Generator<TYiled, TReturn, TNext>) {
        this.__stack.push(generator);
        this.__responses.push(false);
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
            this.__responses.pop();
        }
        return iterResult;
    }

    isComplete() {
        return this.__complete;
    }

    getResponse(generator?: Generator<TYiled, TReturn, TNext>) {
        if (this.__responses.length <= 0) {
            return true;
        }
        if (generator) {
            const index = this.__stack.indexOf(generator);
            if (index >= 0) {
                return this.__responses[index];
            }
            return false;
        }
        return this.__responses[this.__responses.length - 1];
    }

    setResponse(response: boolean, generator?: Generator<TYiled, TReturn, TNext>) {
        if (!this.__responses.length) {
            return;
        }
        if (generator) {
            const index = this.__stack.indexOf(generator);
            if (index >= 0) {
                this.__responses[index] = response;
            }
            return;
        }
        this.__responses[this.__responses.length - 1] = response;
    }
}
