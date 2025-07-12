const { BotFrameworkAdapter, ActivityHandler } = require('botbuilder');

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
});

class BotsfordBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text || 'No message';
            await context.sendActivity(`Hello from Botsford 🤖! You said: "${userMessage}"`);
            await next();
        });
    }
}

const bot = new BotsfordBot();

module.exports = async function (context, req) {
    await adapter.processActivity(req, context.res, async (turnContext) => {
        await bot.run(turnContext);
    });
};
