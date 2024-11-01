const stripe = require('stripe')(process.env.STRIPE_KEY_TEST);

module.exports = {
    async createCheckoutSession(amount, jobId, photographerStripeAccountId) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: 'Pagamento do Job', 
                            },
                            unit_amount: amount, 
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: 'http://localhost:3000/sucesso?session_id={CHECKOUT_SESSION_ID}', 
                cancel_url: 'http://localhost:3000/cancelado', 
                transfer_data: {
                    destination: photographerStripeAccountId, 
                },
                metadata: { jobId }, 
            });

            return { url: session.url };
        } catch (error) {
            console.error('Erro ao criar a sessão de checkout:', error);
            throw new Error('Falha ao criar a sessão de checkout');
        }
    }
};
