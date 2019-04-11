import * as React from 'react';
import './App.css';
import Hello from './components/Hello';

import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Hello name="Cloudy" enthusiasmLevel={1}></Hello>
      </div>
    );
  }
}

export default App;
