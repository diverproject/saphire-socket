var Util = require('saphire-base').Util;
var Socket = require('../index').Socket;

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
		return Util.format('Socket connection with "{0}" - ', this.socket.getAddress().address);
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

module.exports = SocketListener;