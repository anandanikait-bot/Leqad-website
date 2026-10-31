import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { DemoPage } from './components/demo/DemoPage';

export function renderPage(pathname: string) {
  // Eager only in the build: preserve complete static content while clients defer the lesson.
  return renderToString(<StaticRouter location={pathname}><App demoPage={DemoPage} /></StaticRouter>);
}
