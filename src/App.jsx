import React from 'react';
import Excel from './components/Excel';
import Logo from './components/Logo';

import './App.css';

let headers = localStorage.getItem('headers');
let data = localStorage.getItem('data');

if (!headers) {
  headers = ['Title', 'Year', 'Rating', 'Comments'];
  data = [['Test', '2015', '3', 'meh']];
}

function App() {
  return (
    <div>
      <h1>
        <Logo /> Welcome to Whinepad!
      </h1>
      <Excel headers={headers} initialData={data} />
    </div>
  );
}

export default App;
