var expect = require('expect.js');
var InputStream = require('../index').InputStream;

describe('InputStream', function()
{
	it('add buffer', function()
	{
		let data = [
			0xFF,
			0xFF,
			0xFF, 0xFF,
			0xFF, 0xFF,
			0xFF, 0xFF, 0xFF, 0xFF,
			0xFF, 0xFF, 0xFF, 0xFF,
			0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
			0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
			0x3E, 0x00, 0x00, 0x00,
			0x3F, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		];
		let buffer = Buffer.from(data);
		let input = new InputStream(buffer);
		expect(input.length()).to.be(42);
		expect(input.size()).to.be(42);	expect(input.getByte()).to.be(-1);
		expect(input.size()).to.be(41);	expect(input.getUByte()).to.be(255);
		expect(input.size()).to.be(40);	expect(input.getShort()).to.be(-1);
		expect(input.size()).to.be(38);	expect(input.getUShort()).to.be(65535);
		expect(input.size()).to.be(36);	expect(input.getInt()).to.be(-1);
		expect(input.size()).to.be(32);	expect(input.getUInt()).to.be(4294967295);
		expect(input.size()).to.be(28);	expect(input.getLong()).to.be(-1);
		expect(input.size()).to.be(20);	expect(input.getULong()).to.be(18446744073709551615 );
		expect(input.size()).to.be(12);	expect(input.getFloat()).to.be(0.125);
		expect(input.size()).to.be(8);	expect(input.getDouble()).to.be(0.125);
		expect(input.size()).to.be(0);
	});
});