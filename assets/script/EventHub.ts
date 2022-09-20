export default class EventHub<EventId> {
    private __listeners: Map<EventId, Map<Object, Function>> = null;

    constructor() {
        this.__listeners = new Map<EventId, Map<Object, Function>>();
    }

    addEventListener(id: EventId, object: Object, callback: Function) {
        if (!this.__listeners.has(id)) {
            this.__listeners.set(id, new Map<Object, Function>());
        }
        const listener = this.__listeners.get(id);
        if (listener.has(object)) {
            console.warn(`object:${object.constructor.name} will reset listener`);
        }
        listener.set(object, callback);
    }

    triggerEventListener(id: EventId, object?: Object, ...args) {
        const listener = this.__listeners.get(id);
        if (!listener) {
            console.error(`id:${String(id)} doesn't has listenes`);
            return;
        }
        if (object) {
            listener.get(object)?.call(object, ...args);
        } else {
            listener.forEach((callback, object) => {
                callback.call(object, ...args);
            });
        }
    }

    removeEventListener(id: EventId, object?: Object) {
        const listener = this.__listeners.get(id);
        if (!listener) {
            console.error(`id:${String(id)} doesn't has listenes`);
            return;
        }
        if (object) {
            listener.delete(object);
        } else {
            this.__listeners.delete(id);
        }
    }

    removeListnerByObject(object: Object) {
        this.__listeners.forEach((listeners) => {
            listeners.delete(object);
        });
    }

    removeAllEventListeners() {
        this.__listeners.forEach((listeners) => {
            listeners.clear();
        });
        this.__listeners.clear();
    }
}
