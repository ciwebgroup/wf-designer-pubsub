class PubSubService {
  constructor() {
    this.subscribers = {};
    this.isInitialized = false;
    this.listen();
  }

  // Listen for messages from the child iframe
  listen() {
    window.addEventListener("message", (event) => {
      const { topic, data } = event.data;
      if (this.subscribers[topic]) {
        this.subscribers[topic].forEach((callback) => callback(data));
      }
    });

    this.isInitialized = true; // Mark the subscriber as ready
    console.log("Webflow Designer PubSub Service Initialized");
  }

  // Subscribe to a specific topic
  subscribe(topic, callback) {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
    }
    this.subscribers[topic].push(callback);
  }

  // Unsubscribe from a specific topic
  unsubscribe(topic, callback) {
    if (this.subscribers[topic]) {
      this.subscribers[topic] = this.subscribers[topic].filter(
        (cb) => cb !== callback
      );
    }
  }

  // Check if the PubSub service is ready
  isReady() {
    return this.isInitialized;
  }
}

// Instantiate the PubSubService in the parent
const pubSubService = new PubSubService();

// Utility to seamlessly register 'magic' methods
const bindMethods = (scope) => {
  const handler = {
    get(target, prop) {
      if (typeof target[prop] === "function") {
        return (...args) => {
          const topic = prop; // Use method name as topic
          pubSubService.subscribe(topic, target[prop].bind(target));
          target[prop](...args);
        };
      }
      return target[prop];
    },
  };
  return new Proxy(scope, handler);
};

// Example usage
const parentAPI = {
  onDataReceive(data) {
    console.log("Data received in parent:", data);
  },

  onUserAction(action) {
    console.log("User action detected in parent:", action);
  },
};

// Seamlessly bind methods
const seamlessParentAPI = bindMethods(parentAPI);

// Subscribe to specific events without worrying about the mechanics
seamlessParentAPI.onDataReceive();
seamlessParentAPI.onUserAction();
