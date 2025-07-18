const { BotFrameworkAdapter, ConfigurationBotFrameworkAuthentication, ActivityHandler } = require('botbuilder');

// Create the Bot Framework Authentication object.
const auth = new ConfigurationBotFrameworkAuthentication(process.env);

// Create adapter.
const adapter = new BotFrameworkAdapter(auth);

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    await context.sendTraceActivity('OnTurnError Trace', `${error}`, 'https://www.botframework.com/schemas/error', 'TurnError');
    await context.sendActivity('The bot encountered an error or bug.');
};

// Create the main dialog.
class MyBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            await context.sendActivity(`You said '${context.activity.text}'`);
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

// Azure Function entry point.
module.exports = async (context, req) => {
    // The adapter's process method now returns a promise, so we should await it.
    await adapter.process(req, context.res, (context) => bot.run(context));
};
