const {
    ConfigurationBotFrameworkAuthentication,
    BotFrameworkAdapter,
    ActivityHandler
} = require('botbuilder');

// Create the Bot Framework Authentication object.
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({
    validateAuthority: true,
    toBotFromChannelTokenIssuer: 'https://api.botframework.com',
    channelService: process.env.ChannelService, // Add ChannelService
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId,
    MicrosoftAppType: process.env.MicrosoftAppType
});

// Create adapter.
const adapter = new BotFrameworkAdapter(botFrameworkAuthentication);
adapter.onTurnError = async (context, error) => {
    console.error('Error caught in onTurnError:', error);
    await context.sendActivity('Oops! Something went wrong.');
};

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

module.exports = async (context, req) => {
    try {
        // Diagnostics
        console.log("AppId:", process.env.MicrosoftAppId);
        console.log("Password set:", !!process.env.MicrosoftAppPassword);
        console.log("Request headers:", req.headers);
        console.log("Request body:", req.body);

        await adapter.processActivity(req, context.res, async (turnContext) => {
            await bot.run(turnContext);
        });
    } catch (err) {
        console.error('Function error:', err);
        context.res = {
            status: 500,
            body: 'Internal Server Error'
        };
    }
};
