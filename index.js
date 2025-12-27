const { Telegraf } = require('telegraf');
const mercadopago = require('mercadopago');

// O bot usa as chaves que você salvou no painel do Render
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN
});

// Comando inicial quando o cliente clica em "Começar"
bot.start((ctx) => {
    const valor = process.env.VALOR_PRODUTO || "10.90";
    ctx.reply(Bem-vindo! 🚀\n\nPara adquirir seu acesso por apenas R$ ${valor}, clique no botão abaixo para gerar o seu link de pagamento (Pix ou Cartão)., {
        reply_markup: {
            inline_keyboard: [
                [{ text: Pagar R$ ${valor} agora, callback_data: "gerar_pagamento" }]
            ]
        }
    });
});

// Ação que acontece quando o cliente clica no botão de pagar
bot.action('gerar_pagamento', async (ctx) => {
    const valor = parseFloat(process.env.VALOR_PRODUTO || "10.90");
    
    const preference = {
        items: [{
            title: "Acesso Bot VIP",
            unit_price: valor,
            quantity: 1,
        }],
        back_urls: {
            success: "https://t.me/seu_link_aqui", // Coloque o link do seu canal ou bot aqui
        },
        auto_return: "approved",
    };

    try {
        const response = await mercadopago.preferences.create(preference);
        ctx.reply(✅ Link gerado com sucesso!\n\nClique aqui para pagar: ${response.body.init_point});
    } catch (error) {
        console.error(error);
        ctx.reply("❌ Erro ao conectar com o Mercado Pago. Verifique suas credenciais no Render.");
    }
});

bot.launch();
console.log("Bot rodando com sucesso!");
