import React from 'react';
import {render} from 'react-dom';
import TimeMachine from './TimeMachine';
import {Provider} from 'react-redux';
import {store} from '../../coral-framework';

render(
    <Provider store={store}>
      <TimeMachine />
    </Provider>
    , document.querySelector('#timeMachine'));
