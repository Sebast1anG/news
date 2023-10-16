import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import MiniPanels from './Minipanels';

const Root = () => (
    <Router>
        <Routes>
            <Route path="/" element={<App/>} />
            <Route path="/minipanels" element={<MiniPanels/>} />
        </Routes>
    </Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));
