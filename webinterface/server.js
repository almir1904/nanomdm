const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE = process.env.API_BASE || 'http://localhost:9000';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'nanomdm-web', resave: false, saveUninitialized: false}));

function requireLogin(req, res, next) {
  if (!req.session.auth) return res.redirect('/login');
  next();
}

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.render('login', { error: 'Missing credentials' });
  req.session.auth = { username, password };
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => { res.redirect('/login'); });
});

app.get('/', requireLogin, (req, res) => {
  res.render('index', { scepUrl: process.env.SCEP_URL });
});

function apiRequest(method, url, data, auth) {
  return axios({ method, url: API_BASE + url, data, auth });
}

app.get('/push', requireLogin, (req, res) => {
  res.render('push');
});

app.post('/push', requireLogin, async (req, res) => {
  try {
    const { ids } = req.body;
    const response = await apiRequest('get', `/v1/push/${encodeURIComponent(ids)}`, null, req.session.auth);
    res.render('result', { result: response.data });
  } catch (err) {
    res.render('result', { result: err.toString() });
  }
});

app.get('/enqueue', requireLogin, (req, res) => {
  res.render('enqueue');
});

app.post('/enqueue', requireLogin, async (req, res) => {
  try {
    const { ids, plist } = req.body;
    const response = await apiRequest('put', `/v1/enqueue/${encodeURIComponent(ids)}`, plist, req.session.auth);
    res.render('result', { result: response.data });
  } catch (err) {
    res.render('result', { result: err.toString() });
  }
});

app.get('/pushcert', requireLogin, (req, res) => {
  res.render('pushcert');
});

app.post('/pushcert', requireLogin, async (req, res) => {
  try {
    const { cert } = req.body;
    const response = await apiRequest('put', '/v1/pushcert', cert, req.session.auth);
    res.render('result', { result: response.data });
  } catch (err) {
    res.render('result', { result: err.toString() });
  }
});

app.get('/scep-ca', requireLogin, async (req, res) => {
  if (!process.env.SCEP_URL) {
    return res.render('result', { result: 'SCEP_URL not configured' });
  }
  try {
    const response = await axios.get(`${process.env.SCEP_URL}/scep`, {
      params: { operation: 'GetCACert' },
      responseType: 'arraybuffer'
    });
    res.set('Content-Type', 'application/x-x509-ca-cert');
    res.send(response.data);
  } catch (err) {
    res.render('result', { result: err.toString() });
  }
});

app.listen(PORT, () => console.log(`Web interface running on port ${PORT}`));
