export class Engineer {
    #values;
    #listeners = new Map();
    #events = new Map();
    #isSequence = false;

    constructor(initialValues = {}) {
        this.#values = new Map(Object.entries(initialValues));
    }

    #triggerEvent(event, data) {
        const eventListeners = this.#listeners.get(event);
        if (!eventListeners) return;

        for (const eventListener of eventListeners) eventListener(data);
    }

    get(key) {
        return this.#values.get(key);
    }

    set(key, value) {
        this.#values.set(key, value);

        if (this.#isSequence) this.#events.set(key, value);
        else this.#triggerEvent(key, value);
    }

    delete(key) {
        this.#values.delete(key);
    }

    trigger(event, data) {
        if (this.#isSequence) {
            this.#events.set(event, data);
            return;
        }

        this.#triggerEvent(event, data);
    }

    subscribe(event, callback) {
        if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());

        const eventListeners = this.#listeners.get(event);
        eventListeners.add(callback);

        return () => eventListeners.delete(callback);
    }

    sequence(callback) {
        this.#isSequence = true;
        callback();
        this.#isSequence = false;

        for (const [event, data] of this.#events) this.#triggerEvent(event, data);

        this.#events.clear();
    }
}