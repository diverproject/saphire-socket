var net = require('net');
var Util = require('saphire-base').Util;
var SocketInputStream = require('./SocketInputStream');

let SocketStatus =
{
	NONE: 1,
	CONNECTING: 2,
	CONNECTED: 3,
	READY: 4,
	CLOSED: 6,
};

/**
 *
 */
class Socket
{
	/**
	 * @param {number} port
	 * @param {string} host
	 */
	constructor(port = 1001, host = 'localhost')
	{
		this.host = host;
		this.port = port;
		this.status = SocketStatus.NONE;
		this.netSocket = new net.Socket();
		this.socketInputStream = new SocketInputStream();

		let self = this;
		this.netSocket.addListener('close', (hadError) =>
		{
			self.status = SocketStatus.CLOSED;

			if (self.socketListener !== null && self.socketListener !== undefined)
				self.socketListener.onClose(hadError);
		});
		this.netSocket.addListener('connect', () =>
		{
			self.status = SocketStatus.CONNECTED;

			if (self.socketListener !== null && self.socketListener !== undefined)
				self.socketListener.onConnect();
		});
		this.netSocket.addListener('data', (data) =>
		{
			if (typeof data === 'string')
				data = Buffer.from(data, 'ascii');

			if (data instanceof Buffer)
				self.socketInputStream.addBuffer(data);

			if (self.socketListener !== null && self.socketListener !== undefined)
				self.socketListener.onData(data);
		});
		this.netSocket.addListener('drain', () =>
		{
			if (self.socketListener !== null && self.socketListener !== undefined)
				self.socketListener.onDrain();
		});
		this.netSocket.addListener('end', () =>
		{
			self.status = SocketStatus.CLOSED;

			if (self.socketListener !== null && self.socketListener !== undefined)
				self.socketListener.onEnd();
		});
		this.netSocket.addListener('error', (error) =>
		{
			if (self.socketListener !== null && self.socketListener !== undefined)
				self.socketListener.onError(error);
		});
		this.netSocket.addListener('lookup', (error, address, family, host) =>
		{
			self.status = SocketStatus.CONNECTING;

			if (self.socketListener !== null && self.socketListener !== undefined)
				self.socketListener.onLookup(error, address, family, host);
		});
		this.netSocket.addListener('ready', () =>
		{
			self.status = SocketStatus.READY;

			if (self.socketListener !== null && self.socketListener !== undefined)
				self.socketListener.onReady();
		});
		this.netSocket.addListener('timeout', () =>
		{
			if (self.socketListener !== null && self.socketListener !== undefined)
				self.socketListener.onTimeout();
		});
	}

	/**
	 * @returns {string}
	 */
	getHost()
	{
		return this.host;
	}

	/**
	 * @param {string} host
	 * @returns {Socket}
	 */
	setHost(host)
	{
		this.host = Util.nvl(host, this.host);
		return this;
	}

	/**
	 * @returns {number}
	 */
	getPort()
	{
		return this.port;
	}

	/**
	 * @param {number} port
	 * @returns {Socket}
	 */
	setPort(port)
	{
		this.port = Util.nvli(port, this.port);
		return this;
	}

	/**
	 * @returns {string}
	 */
	getAddress()
	{
		return this.netSocket.address().address;
	}

	/**
	 *
	 */
	connect()
	{
		this.netSocket.connect(this.port, this.host);
		this.netSocket.setNoDelay(true);
	}

	/**
	 *
	 */
	close()
	{
		this.netSocket.destroy();
		this.socketInputStream.close();

		delete this.netSocket;
		delete this.socketInputStream;
	}

	/**
	 *
	 * @param {SocketListener} socketListener
	 */
	setSocketListener(socketListener)
	{
		if (!(socketListener instanceof SocketListener))
			throw new Error('socket listener need be instance of SocketListener');

		this.socketListener = socketListener;
	}
}

/**
 * @author Andrew Mello da Silva
 */
class SocketListener
{
	/**
	 *
	 * @param {Socket} socket
	 * @param {boolean} initilizeEvents
	 */
	constructor(socket, initilizeEvents = true)
	{
		if (!(socket instanceof Socket))
			throw new Error('socket need be instance of Socket');

		this.socket = socket;

		if (initilizeEvents)
			this.initilizeEvents();
	}

	/**
	 *
	 */
	initilizeEvents()
	{
		this.close = ((hadError) => {
			console.log(Util.format('{0} closed {1}', this.getBaseMessage(), hadError ? 'with error' : 'forced'));
		});
		this.connect = (() => {
			console.log(Util.format('{0} connected', this.getBaseMessage()));
		})
		this.data = ((data) => {
			let length = data instanceof Buffer || typeof data === 'string' ? data.length : undefined;

			if (typeof data === 'object')
				console.log(Util.format('{0} received a {1} with {2} bytes', this.getBaseMessage(), data.constructor.name, length));
			else
				console.log(Util.format('{0} received a {1} with {2} bytes', this.getBaseMessage(), typeof data, length));
		});
		this.drain = (() => {
			console.log(Util.format('{0} flush output stream', this.getBaseMessage()));
		});
		this.end = (() => {
			console.log(Util.format('{0} had input stream closed', this.getBaseMessage()));
		});
		this.error = ((error) => {
			console.log(Util.format('{0} cause a error: {1}', this.getBaseMessage(), error.stack));
		});
		this.lookup = ((error, address, family, host) => {
			console.log(Util.format('{0} try connection on "{1}#{2}"', this.getBaseMessage(), host, family));
		});
		this.ready = (() => {
			console.log(Util.format('{0} ready to be used"', this.getBaseMessage()));
		});
		this.timeout = (() => {
			console.log(Util.format('{0} lost connection"', this.getBaseMessage()));
		});
	}

	/**
	 *
	 * @returns {string}
	 */
	getBaseMessage()
	{
		return Util.format('Socket connection with "{0}" -', this.socket.getAddress());
	}

	/**
	 *
	 * @param {boolean} hadError
	 */
	onClose(hadError)
	{
		if (this.close !== undefined && this.close !== null)
			this.close(hadError);
	}

	/**
	 *
	 */
	onConnect()
	{
		if (this.connect !== undefined && this.connect !== null)
			this.connect();
	}

	/**
	 *
	 * @param {(string|Buffer)} data
	 */
	onData(data)
	{
		if (this.data !== undefined && this.data !== null)
			this.data(data);
	}

	/**
	 *
	 */
	onDrain()
	{
		if (this.drain !== undefined && this.drain !== null)
			this.drain();
	}

	/**
	 *
	 */
	onEnd()
	{
		if (this.end !== undefined && this.end !== null)
			this.end();
	}

	/**
	 *
	 * @param {Error} error
	 */
	onError(error)
	{
		if (this.error !== undefined && this.error !== null)
			this.error(error);
	}

	/**
	 *
	 * @param {(Error|null)} error
	 * @param {string} address
	 * @param {(string|null)} family
	 * @param {string} host
	 */
	onLookup(error, address, family, host)
	{
		if (this.lookup !== undefined && this.lookup !== null)
			this.lookup(error, address, family, host);
	}

	/**
	 *
	 */
	onReady()
	{
		if (this.ready !== undefined && this.ready !== null)
			this.ready();
	}

	onTimeout()
	{
		if (this.timeout !== undefined && this.timeout !== null)
			this.timeout();
	}
}

module.exports = Socket;
module.exports.SocketStatus = SocketStatus;
module.exports.SocketListener = SocketListener;