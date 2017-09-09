import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <App surveyData={surveyData}
       surveyActionData={surveyActionData}/>,
  rootElement);
