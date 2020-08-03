import App from 'next/app';
// import { ApolloClient, InMemoryCache } from '@apollo/client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/dist/styles.css';
import { Provider } from '@shopify/app-bridge-react';
import translations from '@shopify/polaris/locales/en.json';
import Cookies from 'js-cookie';
import ApolloClient from 'apollo-boost';
const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    // cache: new InMemoryCache(),
    fetchOptions: {
        credentials: 'include'
    },
});

class MyApp extends App {
    render() {
        const { pageProps, Component } = this.props
        const config = { apiKey: API_KEY, shopOrigin: Cookies.get("shopOrigin"), forceRedirect: true };
        return (
            <Provider config={config}>
                <AppProvider i18n={translations}>
                    <ApolloProvider client={client} >
                        <Component {...pageProps} />
                    </ApolloProvider>
                </AppProvider>
            </Provider>
        );
    }
}

export default MyApp