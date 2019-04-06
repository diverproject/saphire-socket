var Util = require('saphire-base/lib/Util');
var Int64BE = require("int64-buffer").Int64BE;
var Uint64LE = require("int64-buffer").Uint64LE;

/**
 * @author Andrew Mello da Silva
 */
class Stream
{
	/**
	 *
	 * @param {Buffer} buffer
	 */
	constructor(buffer)
	{
		if (!(buffer instanceof Buffer) && Array.isArray(buffer))
			throw new Error('only Array and Buffer are accepted');

		if (Array.isArray(buffer))
			buffer = Buffer.from(buffer);

		this.buffer = buffer;
		this.invert = false;
		this.offset = 0;
	}

	addOffset(bytes)
	{
		let offset = this.offset;
		this.offset += bytes;
		return offset;
	}

	/**
	 * @returns {number}
	 */
	getByte()
	{
		return this.buffer.readInt8(this.addOffset(1));
	}

	/**
	 * @returns {number}
	 */
	getUByte()
	{
		return this.buffer.readUInt8(this.addOffset(1));
	}

	/**
	 * @returns {number}
	 */
	getShort()
	{
		return this.invert ? this.buffer.readInt16LE(this.addOffset(2)) : this.buffer.readInt16BE(this.addOffset(2));
	}

	/**
	 * @returns {number}
	 */
	getUShort()
	{
		return this.invert ? this.buffer.readUInt16LE(this.addOffset(2)) : this.buffer.readUInt16BE(this.addOffset(2));
	}

	/**
	 * @returns {number}
	 */
	getInt()
	{
		return this.invert ? this.buffer.readInt32LE(this.addOffset(4)) : this.buffer.readInt32BE(this.addOffset(4));
	}

	/**
	 * @returns {number}
	 */
	getUInt()
	{
		return this.invert ? this.buffer.readUInt32LE(this.addOffset(4)) : this.buffer.readUInt32BE(this.addOffset(4));
	}

	/**
	 * @returns {number}
	 */
	getLong()
	{
		let data = [
			this.getByte(), this.getByte(), this.getByte(), this.getByte(),
			this.getByte(), this.getByte(), this.getByte(), this.getByte()
		];

		return (new Int64BE(Buffer.from(this.invert ? data.reverse() : data))).toNumber();
	}

	getULong()
	{
		let data = [
			this.getByte(), this.getByte(), this.getByte(), this.getByte(),
			this.getByte(), this.getByte(), this.getByte(), this.getByte()
		];

		return (new Uint64LE(Buffer.from(this.invert ? data.reverse() : data))).toNumber();
	}

	getFloat()
	{
		return this.invert ? this.buffer.readFloatLE(this.addOffset(4)) : this.buffer.readFloatBE(this.addOffset(4));
	}

	getDouble()
	{
		return this.invert ? this.buffer.readDoubleLE(this.addOffset(8)) : this.buffer.readDoubleBE(this.addOffset(8));
	}

	getBoolean()
	{
		return this.getByte() !== 0;
	}

	getChar()
	{
		return String.fromCharCode(this.getByte());
	}

	getString(length, encode)
	{
		return this.buffer.toString(Util.nvl(encode, 'utf-8'), this.addOffset(length), this.offset);
	}

	length()
	{
		return this.buffer.length;
	}

	size()
	{
		return this.length() - this.offset;
	}
}

module.exports = Stream;