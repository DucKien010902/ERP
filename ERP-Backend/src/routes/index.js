const Auth = require('./authRoute');
// import New from './newRoute';

const Employee = require('./employeeRoute');
const Chat = require('./chatRoute');
const Admin = require('./adminRoute');
const Document = require('./documentRoute');
const Directory = require('./directoryRoute');
const Product = require('./productsRoute');
function route(app) {
  app.use('/auth', Auth);
  app.use('/employee', Employee);
  app.use('/chat', Chat);
  app.use('/admin', Admin);
  app.use('/document', Document);
  app.use('/directory', Directory);
  app.use('/product', Product);
}
module.exports = route;
