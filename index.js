let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let Registrations = require('./registrations');
let routes = require('./routes');


const flash = require('express-flash');
const session = require('express-session');

const pg = require('pg');
const Pool = pg.Pool;


let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://sethu:codex123@localhost:5432/reg_numbers';

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

let regs = Registrations(pool);
let route = routes(regs)


app.use(session({
  secret: "<add an alert message>",
  resave: false,
  saveUninitialized: true
}));
app.use(flash())

app.use("**/css", express.static("public/css"))
var exphbs = require('express-handlebars');

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: './views',
  layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())


app.get('/', route.index)
app.post('/reg_numbers', route.addRegNumbers)
app.post('/reset', route.clearButton)
app.get('/show', route.filteredRegs)

let PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});