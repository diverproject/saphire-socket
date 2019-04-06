var expect = require('expect.js');
var SocketInputStream = require('../index').SocketInputStream;

describe('SocketInputStream', function()
{
	it('add buffers', function()
	{
		var bytes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		var buffer1 = Buffer.from(bytes.slice(0, 1));
		var buffer2 = Buffer.from(bytes.slice(1, 3));
		var buffer3 = Buffer.from(bytes.slice(3, 6));
		var buffer4 = Buffer.from(bytes.slice(6, 9));

		var input = new SocketInputStream();
		input.addBuffer(buffer1);
		input.addBuffer(buffer2);
		input.addBuffer(buffer3);
		input.addBuffer(buffer4);

		expect(input.toArray()).to.be.eql(bytes);
	});
});