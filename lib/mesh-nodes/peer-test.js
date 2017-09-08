var SimplePeer = require('simple-peer');
var wrtc = require('wrtc');
var peer1 = new SimplePeer({ initiator: true, wrtc });
var peer2 = new SimplePeer({ wrtc });
peer1.on('signal', function (data) {
    peer2.signal(data);
});
peer2.on('signal', function (data) {
    peer1.signal(data);
});
peer1.on('connect', function () {
    peer1.send('hey peer2, how is it going?');
});
peer2.on('data', function (data) {
    console.log('got a message from peer1: ' + data);
});
//# sourceMappingURL=peer-test.js.map