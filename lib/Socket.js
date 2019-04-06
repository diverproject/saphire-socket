var net = require('net');
var Util = require('saphire-base').Util;
var SocketListener = require('../').SocketListener;
var SocketInputStream = require('../').SocketInputStream;

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
		this.netSocket.addListener('lookup', () => { self.status = SocketStatus.CONNECTING; });
		this.netSocket.addListener('connect', () => { self.status = SocketStatus.CONNECTED; });
		this.netSocket.addListener('ready', () => { self.status = SocketStatus.READY; });
		this.netSocket.addListener('end', () => { self.status = SocketStatus.CLOSED; });
		this.netSocket.addListener('close', () => { self.status = SocketStatus.CLOSED; });
		this.netSocket.addListener('data', (data) =>
		{
			if (typeof data === 'string')
				data = Buffer.from(data, 'ascii');

			if (data instanceof Buffer)
				self.socketInputStream.toBuffer(data);
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
	}

	/**
	 *
	 * @param {SocketListener} socketListener
	 */
	setSocketListener(socketListener)
	{
		if (!(socketListener instanceof SocketListener))
			throw new Error('socket listener need be instance of SocketListener');

		if (this.socketListener !== null)
		{
			this.netSocket.removeListener('close', socketListener.close);
			this.netSocket.removeListener('connect', socketListener.connect);
			this.netSocket.removeListener('drain', socketListener.drain);
			this.netSocket.removeListener('data', socketListener.data);
			this.netSocket.removeListener('end', socketListener.end);
			this.netSocket.removeListener('error', socketListener.error);
			this.netSocket.removeListener('lookup', socketListener.lookup);
			this.netSocket.removeListener('ready', socketListener.ready);
			this.netSocket.removeListener('timeout', socketListener.timeout);
		}

		this.socketListener = socketListener;
		this.netSocket.addListener('close', socketListener.close);
		this.netSocket.addListener('connect', socketListener.connect);
		this.netSocket.addListener('drain', socketListener.drain);
		this.netSocket.addListener('data', socketListener.data);
		this.netSocket.addListener('end', socketListener.end);
		this.netSocket.addListener('error', socketListener.error);
		this.netSocket.addListener('lookup', socketListener.lookup);
		this.netSocket.addListener('ready', socketListener.ready);
		this.netSocket.addListener('timeout', socketListener.timeout);
	}
}

module.exports = Socket;
module.exports.SocketStatus = SocketStatus;