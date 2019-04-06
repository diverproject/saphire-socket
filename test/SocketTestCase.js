var expect = require('expect.js');
var Socket = require('../index').Socket;

describe('Socket', function()
{
	it('socket connection', function()
	{
		let received = null;
		let socket = new Socket();
		socket.setHost('127.0.0.1');
		socket.setPort(8000);
		socket.connect();
		socket.netSocket.addListener('ready', (data) => {
			socket.netSocket.write('Saphire Socket send data', 'ascii');
		});
		socket.netSocket.addListener('data', (data) => {
			received = data.toString();
		});
		setTimeout(() => {
			socket.close();
			expect(received).to.be('Saphire Socket send data');
		}, 1000);
	});
});