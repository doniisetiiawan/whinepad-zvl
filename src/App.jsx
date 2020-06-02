import React from 'react';
import Logo from './components/Logo';
import Whinepad from './components/Whinepad';
import schema from './schema';

import './App.css';

let data = JSON.parse(JSON.stringify(localStorage.getItem('data')));

// default example data, read from the schema
if (!data) {
  data = {};
  schema.forEach((item) => data[item.id] = item.sample);
  data = [data];
}

function App() {
  return (
    <div>
      <div className="app-header">
        <Logo /> Welcome to Whinepad!
      </div>
       <Whinepad schema={schema} initialData={data} />
    </div>
  );
}

export default App;
