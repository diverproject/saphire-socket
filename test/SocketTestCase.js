var expect = require('expect.js');
var Socket = require('../index').Socket;
var received = null;

describe('Socket', function()
{
	it('socket connection', function()
	{
		let socket = new Socket();
		socket.received = null;
		socket.setHost('127.0.0.1');
		socket.setPort(8000);
		socket.netSocket.addListener('ready', (data) => {
			socket.netSocket.write('Saphire Socket send data', 'ascii');
		});
		socket.netSocket.addListener('data', (data) => {
			received = data.toString();
		});
		socket.connect();
		setTimeout(() => {
			socket.close();
		}, 3000);
	});

	it('socket received data', function(done) {
		this.timeout(500);
		setTimeout(() => {
			expect(received).to.be('Saphire Socket send data');
			done();
		}, 100);
	});
});