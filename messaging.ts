import amqp, { type Channel, type Connection } from 'amqplib'

let channel: Channel

export async function connectToMessageBroker(): Promise<void> {
    const connection: Connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq')
    channel = await connection.createChannel()
    console.log('Connected to RabbitMQ')
}

export async function publishMessage(queue: string, message: object): Promise<void> {
    if (!channel) {
        throw new Error('Message broker not connected')
    }
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
}

export async function consumeMessages(queue: string, handler: (msg: object) => void): Promise<void> {
    if (!channel) {
        throw new Error('Message broker not connected')
    }
    await channel.assertQueue(queue)
    channel.consume(queue, (msg) => {
        if (msg !== null) {
            handler(JSON.parse(msg.content.toString()))
            channel.ack(msg)
        }
    });
}
