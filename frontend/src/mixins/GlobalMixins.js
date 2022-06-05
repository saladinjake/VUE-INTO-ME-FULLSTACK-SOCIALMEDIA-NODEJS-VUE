/* eslint-disable */
export const SocketConnection = function() {
    let env = 'dev';
    if (env === 'dev') {
        return 'http://127.0.0.1:3000';
    }

    return 'http://18.221.248.4:3000';
}
