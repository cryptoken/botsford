// messages/index.js
// ===============================================================
// Simple echo bot for Azure Functions using SECRET‑based auth
// ===============================================================

const { BotFrameworkAdapter, ActivityHandler } = require('botbuilder');

/*---------------------------------------------------------------
  1. Adapter configured with App ID + App Password
----------------------------------------------------------------*/
const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});

/*---------------------------------------------------------------
  2. Robust global error handler
----------------------------------------------------------------*/
adapter.onTurnError = async (context, error) => {
  console.error('[onTurnError] unhandled error:', error);
  await context.sendTraceActivity(
    'OnTurnError Trace',
    error.toString(),
    'https://www.botframework.com/schemas/error',
    'TurnError'
  );
  await context.sendActivity('🚨 The bot ran into a problem.');
};

/*---------------------------------------------------------------
  3. Minimal ActivityHandler implementation
----------------------------------------------------------------*/
class MyBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      await context.sendActivity(
        `This is the final test 🧪. You said: “${context.activity.text}”`
      );
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      for (const member of context.activity.membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity('Hello and welcome! 👋');
        }
      }
      await next();
    });
  }
}

const bot = new MyBot();

/*---------------------------------------------------------------
  4. Azure Function entry point
----------------------------------------------------------------*/
module.exports = async function (context, req) {
  console.log('🔔 Function triggered');
  try {
    await adapter.process(req, context.res, (turnContext) =>
      bot.run(turnContext)
    );
  } catch (err) {
    console.error('[Function error]', err);
    throw err;
  }
};
