import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { legacyDestination } from './lib/routes';
import './index.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-700.css';
import 'lenis/dist/lenis.css';

// Migrate before hydration so legacy links never briefly display the wrong page.
const destination = legacyDestination(window.location.hash);
if (destination) window.history.replaceState(null, '', destination + window.location.search);

const root = document.getElementById('root')!;
const app = <BrowserRouter><App /></BrowserRouter>;
if (root.dataset.route === window.location.pathname && root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  root.replaceChildren();
  createRoot(root).render(app);
}
