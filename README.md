# Micro Frontend with ReactJS, Webpack Module Federation

## Overview

This project serves as a demonstration of Micro Frontend implementation utilizing React and Module Federation.
Inspired by the best practices outlined in Luca Mezzalira's "Build Micro Frontends" book, it addresses several challenges highlighted within the book.

This project includes 1 host app and 3 micro frontend:

### 1. Host

**Description**: The parent application responsible for managing and hosting remote micro frontend apps.

**Functionality**:

- Integration of remote micro frontend apps.
- Routing and navigation control.

### 2. Auth Micro Frontend

**Description**: Handles authentication-related functionalities.

### 3. Cart Micro Frontend

**Description**: Manages the shopping cart functionality.

### 4. Product Micro Frontend

**Description**: Deals with displaying and managing the product list.

![Alt text](/document/image-3.png)

## Challenges Addressed

### 1. **Decoupling Routes**

Implementing a strategy to manage routes independently between host and remote apps. Each remote app autonomously handles its set of routes.

![Routing](/document/image-5.png)

**Solution**: This project uses Browser Router/History for host app, and Memory Router/History for remote apps. So If user clicks a link in host app then route change details propagate down to remote app to update its Memory Router/History accordingly. In similar way if user clicks a link from child application then path is be bubbled to host app to make necessary changes in Browser Router/History.

### 2. **Event Listening Issue**

Overcoming difficulties in event listening between remote and host apps due to the delayed loading of the remoteEntry file.

**Example Scenario**: Consider the scenario where the host loads first, and subsequent Products remote apps load later.
The host immediately triggers an event `host.router.update` meant for a Product app that is still in the loading process,
the Product app may fail to capture the event.
![event listening flow](/document/image.png)
**Solution**: To mitigate this, a mechanism has been developed to store emitted events and re-emit them once the remote app successfully loads. At this time, Product app still get information of event `host.router.update` from host app at `initialized` lifecycle state, and continue to handle next step.
The library supports this mechanism: [nano-event-bus-ts](https://github.com/lequochung19971/nano-event-bus-ts)

## Technologies and Solutions

- **Webpack Module Federation**: Apply dynamic loading of Micro Frontend apps during runtime, focusing primarily on Client-Side Rendering.
- **ReactJS**: Chosen as the primary framework for its versatility and robustness.
- **Horizontal-Split Architectures**: Adopted to achieve a decoupled and scalable frontend architecture. (_Read more in Luca Mezzalira's "Build Micro Frontends" book_)
- **Communication**: [nano-event-bus-ts](https://github.com/lequochung19971/nano-event-bus-ts).

## How to start project

### Install

```
pnpm run install
```

### Start development

```
pnpm run dev
```

### Start production

Build
```
pnpm run build
```

Serve production
```
pnpm run serve
```
