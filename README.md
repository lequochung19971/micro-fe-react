# Micro Frontend with ReactJS, Webpack Module Federation
## Introduction
This project serves as a demonstration of Micro Frontend implementation utilizing React and Module Federation. 
Inspired by the best practices outlined in Luca Mezzalira's "Build Micro Frontends" book, it addresses several challenges highlighted within the text.
## Challenges Addressed:
1. <strong>Decoupling Routes</strong>: Implementing a strategy to manage routes independently between host and remote apps. Each remote app autonomously handles its set of routes.

2. <strong>Event Listening Issue</strong>: Overcoming delayed event listening due to the late loading of the remoteEntry file.
   - Example Scenario: Consider the scenario where the host loads first, and subsequent remote apps load later.
   If the host immediately triggers an event meant for a remote app that is still in the loading process,
   the remote app may fail to capture the event. To mitigate this, a mechanism has been developed to store emitted events and re-emit them once the remote app successfully loads.
## Technologies and Solutions:
- <strong>Webpack Module Federation</strong>: Employed for dynamic loading of Micro Frontend apps during runtime, focusing primarily on Client-Side Rendering.
- <strong>Horizontal-Split Architectures</strong>: Adopted to achieve a decoupled and scalable frontend architecture.
- <strong>ReactJS</strong>: Chosen as the primary framework for its versatility and robustness.
