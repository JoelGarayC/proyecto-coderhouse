import exphbs from 'express-handlebars';
import handlebars from 'handlebars';
import path from 'path';
import pathBase from './utils/pathBase.js';

export function createHbs(app) {
  // Configurar Handlebars como motor de plantillas
  const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'index',
    handlebars: handlebars,
    layoutsDir: pathBase + '/src/views/layouts',
    partialsDir: pathBase + '/src/views/partials'
  });
  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.set('views', pathBase + '/src/views');
}


export function validateMIME(app) {
  app.get('/public/js/index.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(pathBase, 'public', 'js', 'index.js'));
  });
  app.get('/public/css/styles.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(pathBase, 'public', 'css', 'styles.css'));
  });
}