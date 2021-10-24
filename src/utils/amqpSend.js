#!/usr/bin/env node
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://test:test@10.10.5.32/testHost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        let queue = 'testQueue';
        let msg = 'Hello world';

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
    });
});

setTimeout(function() {
    connection.close();
    process.exit(0)
}, 500);