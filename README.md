# Webflow Designer Plugin Pub/Sub Framework

## Overview

This framework provides an **extendable pub/sub service** designed for **Webflow's Designer API**, allowing plugin developers full control over Webflow’s parent DOM. It goes beyond the capabilities of Webflow's native SDK by circumventing CORS and enabling direct DOM manipulation on the Webflow Designer (`webflow.com`).

With this framework, developers can:
- Seamlessly subscribe to events in the parent window.
- Publish messages from a child iframe (plugin) to the parent Webflow Designer.
- Extend the Webflow SDK to allow the creation of native Webflow elements, rather than just plugin components.
- Customize all parts of the Webflow Designer interface.
- Automatically detect if the parent page has the subscriber service installed and ready to receive messages.

## Features

1. **Full Control over Webflow DOM**: 
   The framework gives you direct access to the parent DOM, allowing full customization of the Webflow Designer interface and enabling actions that are otherwise restricted by Webflow's native API.

2. **CORS Circumvention**: 
   The system works across domains by using `postMessage` to pass data between the child iframe and the parent window, effectively bypassing CORS limitations for JavaScript execution on the `webflow.com` domain.

3. **Seamless Pub/Sub Service**: 
   The service abstracts away the complexity of managing events between the parent and child, allowing developers to register functions based on the method names without worrying about handling events manually.

4. **Parent Subscriber Detection**: 
   The framework includes a stateful flag that automatically detects if the parent Webflow Designer page has the subscriber service initialized, ensuring smooth communication with the child iframe.

## How It Works

### Parent Window (Subscriber)

The **PubSubService** is instantiated in the parent window and listens for messages from the child iframe. The service subscribes to specific topics (e.g., `onDataReceive`, `onUserAction`) and invokes registered callback functions.

The parent window's API can be easily extended with the `bindMethods` utility, which seamlessly hooks into the pub/sub system using method names as topics.

### Child Iframe (Publisher)

The **ChildPublisher** class in the child iframe allows publishing messages to the parent Webflow Designer. It provides a clean and simple API for triggering events (like `onDataReceive` and `onUserAction`) and checking whether the parent subscriber is initialized and ready.

### Example

1. In the parent window (Webflow Designer):
   ```javascript
   const parentAPI = {
     onDataReceive(data) {
       console.log("Data received in parent:", data);
     },

     onUserAction(action) {
       console.log("User action detected in parent:", action);
     }
   };

   // Bind methods and automatically subscribe to topics
   const seamlessParentAPI = bindMethods(parentAPI);
   seamlessParentAPI.onDataReceive();
   seamlessParentAPI.onUserAction();
