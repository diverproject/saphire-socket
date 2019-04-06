# Saphire Socket

This is a base library that create a socket connection with any server without packet data structure.
That means you can specify how you define the packet data communication.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

### Prerequisites

You need have [Node Package Manager (NPM)](https://www.npmjs.com/) to install Saphire Socket.

### Installing

``
npm install saphire-socket
``

### Running the tests

The project has a folder .vscode that is used on Visual Studio Code, with a DEBUG Plugin and using Mocha you can test all objects/classes.

## Usage

```
var Socket = require('saphire-socket').Socket; // Socket class to create connection socket
var SocketListener = require('saphire-socket).SocketListener; // SocketListener class to add a socket connection
var SocketInputStream = require('saphire-socket).SocketInputStream; // SocketInputStream to read raw data bytes

(...)
```

### Socket

Class to create a connection socket based on net.Socket (NodeJS) and works with SocketInputStream to read data and SocketListener to listen certains events.

### SocketInputStream

Used to receive Buffer on queue and read raw data bytes into number (int, float...), boolean, considering queue position and automatic offer the next buffer.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/diverproject/diamond-lang/tags).

*The revision log have somethings different because it's used developers found more easy changes made and make github commit messages more **clean***.

## Authors

* **Andrew Mello da Silva** - *Developer* - [Driw](https://github.com/Driw)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* **Billie Thompson** - *[Readme template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)* - [PurpleBooth](https://github.com/PurpleBooth)