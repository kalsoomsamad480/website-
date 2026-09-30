import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource-variable/fraunces';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/manrope';

import './styles/variables.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/global.css';
import './styles/animations.css';

import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
