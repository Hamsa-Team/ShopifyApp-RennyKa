const Koa = require('koa');
const mongo = require('koa-mongo')
const next = require('next');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const env = require('dotenv').config();
fs = require('fs');
const { ApolloServer } = require("apollo-server-koa");
const typeDefs = require('./schema');
const resolvers = require("./resolvers");
require('isomorphic-fetch');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
const getSubscriptionUrl = require('./getSubscriptionUrl');

const graphQLServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    playground: {
        endpoint: "/graphql"
    },
    bodyParser: true
});
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');


app.use(mongo({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME,

}));
app.use(bodyParser());
app.use(session({ secure: true, sameSite: 'none' }, app));
app.keys = ['107']
const nextApp = next({ dev: true });
const handler = nextApp.getRequestHandler();
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST } = process.env;

const webhook = receiveWebhook({ secret: `81ea7f2cab2e3c629cf9776fb50650b4517113cfdf0d41a72e5cbbe2f3e4e335` });


(async () => {
    try {
        nextApp.prepare()

        graphQLServer.applyMiddleware({
            app: app
        });

        router.post('/webhooks/products/create', webhook, (ctx) => {
            console.log('received webhook: ', ctx.state.webhook);
        });

        router.get('(.*)', verifyRequest(), async ctx => {
            await handler(ctx.req, ctx.res);
            ctx.respond = false;
            ctx.res.statusCode = 200;
        });

        app
            .use(
                createShopifyAuth({
                    apiKey: SHOPIFY_API_KEY,
                    secret: SHOPIFY_API_SECRET_KEY,
                    scopes: ['read_products', 'write_products'],
                    async afterAuth(ctx) {
                        const { shop, accessToken } = ctx.session;
                        ctx.cookies.set('shopOrigin', shop, {
                            httpOnly: false,
                            secure: true,
                            sameSite: 'none'
                        });
                        const registration = await registerWebhook({
                            address: `${HOST}/webhooks/products/create`,
                            topic: 'PRODUCTS_CREATE',
                            accessToken,
                            shop,
                            apiVersion: ApiVersion.October19
                        });
                        console.log(`${HOST}/webhooks/products/create`);
                        if (registration.success) {
                            console.log('Successfully registered webhook!');
                        } else {
                            console.log('Failed to register webhook', registration.result);
                        }
                        await getSubscriptionUrl(ctx, accessToken, shop);
                    },
                }),
            )
            .use(graphQLProxy({ version: ApiVersion.October19 }))
            .use(router.allowedMethods())
            .use(router.routes())
        app.listen(3000, (_) => { console.log('Server run at port 8000') });

    } catch (e) {
        console.error(e);
        process.exit();
    }
})();

