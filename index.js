module.exports = async function (context, req) {
    context.log('Botsford backend received a message!');

    const userMessage = req.body?.text || 'No text found';
    context.log('Message:', userMessage);

    // Example: simple echo reply
    const reply = {
        type: 'message',
        text: `Hello from Botsford 🤖! You said: "${userMessage}"`
    };

    context.res = {
        status: 200,
        body: reply
    };
};
