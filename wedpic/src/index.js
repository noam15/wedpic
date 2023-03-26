import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Pics from './Pics/Pics';
import HomePage from './HomePage/HomePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/pics' element={<Pics />} />
				<Route path='/thank-you' />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
