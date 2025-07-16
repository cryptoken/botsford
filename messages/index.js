const {
    ConfigurationBotFrameworkAuthentication,
    BotFrameworkAdapter,
    ActivityHandler
} = require('botbuilder');
const jwt = require('jsonwebtoken');

// Create bot framework authentication. The ConfigurationBotFrameworkAuthentication constructor
// will automatically read the required environment variables.
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({});

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

module.exports = async function (context, req) {
    // DIAGNOSTIC: Log the critical authentication values to find the mismatch.
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        context.log(`DIAGNOSTIC - Token 'aud' claim: ${decoded.aud}`);
        context.log(`DIAGNOSTIC - Environment 'MicrosoftAppId': ${process.env.MicrosoftAppId}`);
    } catch (err) {
        context.log('DIAGNOSTIC - Error decoding token:', err.message);
    }

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
