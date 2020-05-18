import React from 'react';
import ReactDOM from 'react-dom';

import Popup from './Popup';

ReactDOM.render(<Popup />, document.querySelector('#root'));

if (module.hot)
  module.hot.accept()