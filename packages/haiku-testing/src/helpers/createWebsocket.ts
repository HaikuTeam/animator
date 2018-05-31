import Websocket from 'haiku-serialization/src/ws/Websocket';
export const MESSAGE_NAME = 'TEST_MESSAGE';
const HAIKU_WS_SECURITY_TOKEN = 'abc123';

export default (host: string, port: string, folder: string, alias: string, type: string): Websocket => {
  const websocket = new Websocket(
    `ws://${host}:${port}/?folder=${folder}&alias=${alias}&type=${type}&token=${HAIKU_WS_SECURITY_TOKEN}`,
  );

  const requests = {};

  websocket.message = (message) => {
    const data = JSON.stringify(message);
    websocket.send(data);
  };

  websocket.request = (method, params, cb, type) => {
    const id = Math.random() + '';
    const message = {id, method, params, type};
    requests[id] = cb;
    return websocket.message(message);
  };

  websocket.action = (method, params, cb) => {
    return websocket.request(method, params, cb, 'action');
  };

  websocket.on('message', (resp) => {
    const reply = JSON.parse(resp);
    const cb = requests[reply.id];

    if (cb) {
      return cb(reply.error, reply.result);
    }

    return websocket.emit(MESSAGE_NAME, reply);
  });

  return websocket;
};
