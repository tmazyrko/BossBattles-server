#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
const { v4: uuidv4 } = require('uuid');

const args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Missing args");
    process.exit(1);
}

amqp.connect('amqp://test:test@10.10.5.32/%2F', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
            let correlationId = uuidv4();
            let query = "SHOW TABLES;";

            console.log(' [x] Sending query: %s', query);

            channel.consume(q.queue, function(msg) {
                if (msg.properties.correlationId == correlationId) {
                    console.log(' [.] Got %s', msg.content.toString());
                    setTimeout(function() {
                        connection.close();
                        process.exit()
                    }, 500);
                }
            }, {
                noAck: true
            });

            channel.sendToQueue('sqlQueue',
                Buffer.from(query), {
                    correlationId: correlationId,
                    replyTo: q.queue });
        });
    });
});

function generateUUID() {

    return Math.random().toString() +
            Math.random().toString() +
            Math.random().toString();
}
