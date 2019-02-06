import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './store/configureStore'
import App from './App'

import * as ServiceWorker from './serviceWorker'

import './index.css'
import './fonts.css'

const startApp = () => {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    );

    ServiceWorker.register();
};

if(!window.cordova) {
    startApp()
} else {
    document.addEventListener('deviceready', startApp, false)
}

