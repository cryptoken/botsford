const { app } = require('@azure/functions');

app.http('Messages', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log('Botsford backend received a message!');

    const body = await request.json();
    const userMessage = body?.text || body?.value || 'No text found';

    context.log('Message:', userMessage);

    return {
      status: 200,
      body: JSON.stringify({
        type: 'message',
        text: `Hello from Botsford 🤖! You said: "${userMessage}"`
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
});
