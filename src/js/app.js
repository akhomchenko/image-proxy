import React from 'react/addons';
import App from './components/App';

require('whatwg-fetch'); // call polyfill

React.render(<App/>, document.getElementById('content'));
