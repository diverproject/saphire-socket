var Util = require('saphire-base').Util;
var Queue = require('saphire-base').Queue;
var InputStream = require('./InputStream');

/**
 * @author Andrew Mello da Silva
 */
class SocketInputStream extends InputStream
{
	/**
	 *
	 */
	constructor()
	{
		super(Buffer.alloc(0));

		this.reserved = 0;
		this.offset = 0;
		this.buffer = null;
		this.buffers = new Queue;
		this.validOffset = true;
	}

	/**
	 * @param {number} bytes
	 */
	reserve(bytes)
	{
		this.validOffset = this.offset === 0;
		this.prepareBuffer(false);
		this.reserved = Util.nvli(bytes, 0);
	}

	/**
	 * @param {boolean} [optional] validOffset
	 */
	prepareBuffer(validOffset)
	{
		if (Util.nvl(validOffset, this.validOffset) && this.offset >= this.reserved)
			throw new Error('no data reserved');

		if (this.buffer !== null && this.offset >= this.buffer.length)
			this.buffer = null;

		if (this.buffer === null)
		{
			if (this.buffers.isEmpty())
				throw new Error('no more buffer');

			this.buffer = this.buffers.poll();
			this.offset = 0;
		}
	}

	/**
	 * @param {Buffer} buffer
	 */
	addBuffer(buffer)
	{
		if (buffer instanceof Buffer)
			this.buffers.offer(buffer);
	}

	/**
	 * @returns {number}
	 */
	getByte()
	{
		this.prepareBuffer(); return super.getByte();
	}

	/**
	 * @returns {number}
	 */
	getUByte()
	{
		this.prepareBuffer(); return super.getUByte();
	}

	/**
	 * @returns {number}
	 */
	getShort()
	{
		this.prepareBuffer(); return super.getShort();
	}

	/**
	 * @returns {number}
	 */
	getUShort()
	{
		this.prepareBuffer(); return super.getUShort();
	}

	/**
	 * @returns {number}
	 */
	getInt()
	{
		this.prepareBuffer(); return super.getInt();
	}

	/**
	 * @returns {number}
	 */
	getUInt()
	{
		this.prepareBuffer(); return super.getUInt();
	}

	/**
	 * @returns {number}
	 */
	getLong()
	{
		this.prepareBuffer(); return super.getLong();
	}

	/**
	 * @returns {number}
	 */
	getULong()
	{
		this.prepareBuffer(); return super.getULong();
	}

	/**
	 * @returns {number}
	 */
	getFloat()
	{
		this.prepareBuffer(); return super.getFloat();
	}

	/**
	 * @returns {number}
	 */
	getDouble()
	{
		this.prepareBuffer(); return super.getDouble();
	}

	/**
	 * @returns {number}
	 */
	length()
	{
		let length = this.buffer === null ? 0 : this.buffer.length;

		this.buffers.elements.forEach(element => {
			length += element.length;
		});

		return length;
	}

	/**
	 * @returns {number}
	 */
	size()
	{
		return this.length() - this.offset;
	}

	/**
	 *
	 */
	close()
	{
		this.buffers.clear();
		delete this.buffer;
		delete this.buffers;
	}

	/**
	 * @returns {Array}
	 */
	toArray()
	{
		let bytes = new Array(this.size());
		let offset = 0;

		if (this.buffer !== null)
			for (let i = this.offset; i < this.buffer.length; i++)
			bytes[offset++] = this.buffer.buffer[i];

		this.buffers.forEach(buffer =>
		{
			let array = new Uint8Array(buffer);
			array.forEach(byte =>
			{
				bytes[offset++] = byte;
			});
		});

		return bytes;
	}

	/**
	 * @returns {Buffer}
	 */
	toBuffer()
	{
		return Buffer.from(this.toArray());
	}
}

module.exports = SocketInputStream;