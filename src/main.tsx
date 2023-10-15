import ReactDOM from 'react-dom/client'
import Index from './pages/Index.tsx'
import './main.css'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import {ToastContainer} from 'react-toastify';
import React from "react";

// import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
import 'react-toastify/dist/ReactToastify.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
       <ToastContainer />
       <Index/>
   </React.StrictMode>
)
