const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const OpenAI = require('openai');
require('dotenv').config(); // новий модуль, який покращить роботу чат-боту

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Функція для надсилання тексту до ChatGPT і отримання результату
async function getChatGPTResponse(prompt) {
    try {
        const response = await openai.complete({
            engine: 'text-davinci-003', // Оновлено назву моделі та змінено на текст
            prompt: prompt,
            maxTokens: 150 // змінено на 150 з 100
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Помилка отримання відповіді від ChatGPT API:', error);
        return 'Вибачте, сталася помилка. Будь ласка, спробуйте пізніше.';
    }
}

bot.start((ctx) => ctx.reply('Hello brotherman')) // Зміна відповіді
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))


// Обробник вхідних повідомлень бота
bot.hears('gpt', async (ctx) => {
    const userMessage = ctx.message.text;

    // Отримуємо відповідь від ChatGPT за допомогою введеного повідомлення користувача
    const chatGPTResponse = await getChatGPTResponse(userMessage);

    // Надсилаємо отриману відповідь користувачеві
    ctx.reply(chatGPTResponse);
});

bot.launch({
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN,
        port: process.env.PORT,
    },
});

// Завершити програму
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
