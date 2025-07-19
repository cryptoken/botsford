const { BotFrameworkAdapter, ConfigurationBotFrameworkAuthentication, ActivityHandler } = require('botbuilder');

// Create the Bot Framework Authentication object with enhanced logging
const auth = new ConfigurationBotFrameworkAuthentication(process.env);

// Log the configuration being used
console.log('Bot Authentication Configuration:');
console.log('MicrosoftAppId:', process.env.MicrosoftAppId);
console.log('MicrosoftAppPassword exists:', !!process.env.MicrosoftAppPassword);
console.log('MicrosoftAppTenantId:', process.env.MicrosoftAppTenantId);
console.log('MicrosoftAppType:', process.env.MicrosoftAppType);

// Create adapter with authentication
const adapter = new BotFrameworkAdapter(auth);

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    console.error(`Error stack: ${error.stack}`);
    console.error(`Context activity: ${JSON.stringify(context.activity, null, 2)}`);
    await context.sendTraceActivity('OnTurnError Trace', `${error}`, 'https://www.botframework.com/schemas/error', 'TurnError');
    await context.sendActivity('The bot encountered an error or bug.');
};

// Create the main dialog.
class MyBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            await context.sendActivity(`This is the final test. You said: '${context.activity.text}'`);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome!');
                }
            }
            await next();
        });
    }
}

const bot = new MyBot();

// Azure Function entry point
module.exports = async function (context, req) {
    console.log('Function triggered - Request received');
    console.log(`Request method: ${req.method}`);
    console.log(`Request headers: ${JSON.stringify(req.headers, null, 2)}`);
    console.log(`Request body: ${JSON.stringify(req.body, null, 2)}`);
    
    try {
        // Process the request through the bot adapter
        await adapter.process(req, context.res, (context) => bot.run(context));
        console.log('Bot processing completed successfully');
    } catch (error) {
        console.error(`Function error: ${error}`);
        console.error(`Function error stack: ${error.stack}`);
        throw error;
    }
};
