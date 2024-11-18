import amqplib from 'amqplib'

let connection: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

export async function connectToRabbitMQ(rabbitmqUrl: string): Promise<void> {
    try {
        connection = await amqplib.connect(rabbitmqUrl);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (err) {
        console.error('Failed to connect to RabbitMQ:', err);
    }
}

export async function publishMessage(queue: string, message: object): Promise<void> {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message published to queue ${queue}:`, message);
}

export async function consumeMessages(queue: string, callback: (message: object) => void): Promise<void> {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
        if (msg) {
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel!.ack(msg);
        }
    });
}
