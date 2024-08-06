const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const leaguepediaRoutes = require('./routes/enableRoutes/leaguepediaRoutes');
const riotAPIRoutes = require('./routes/enableRoutes/riotAPIRoutes');
const authRoutes = require('./routes/authentication/authRoutes');
const userRoutes = require('./routes/enableRoutes/userRoutes');
const passRoutes = require('./routes/authentication/changePass');
const gameRoutes = require('./routes/enableRoutes/gameRoutes');
const checkRoutes = require('./routes/authentication/checkAuth');
const statsRoutes = require('./routes/enableRoutes/statsRoutes');

const uri2 = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@blitzdraft.wsv38m3.mongodb.net/?retryWrites=true&w=majority&appName=BlitzDraft`;
app.set('trust proxy', 1);

app.use(express.json());
app.use(helmet());
app.use(cookieParser());


const corsOptions = {
  origin: ['https://blitzdraftlol.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: [
    'X-CSRF-Token', 
    'X-Requested-With', 
    'Accept', 
    'Accept-Version', 
    'Content-Length', 
    'Content-MD5', 
    'Content-Type', 
    'Date', 
    'X-Api-Version',
    'x-server-token',
    'x-server-secret',
    'Access-Control-Allow-Origin',
  ],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.options('*', (req, res) => {
  res.status(200).send();
});
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.jsx')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

mongoose.connect(uri2, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

app.use('/auth', authRoutes);
app.use('/auth', checkRoutes)
app.use('/account', passRoutes);
gameRoutes(app);
leaguepediaRoutes(app);
riotAPIRoutes(app);
userRoutes(app);
statsRoutes(app);


app.get('/', (req, res) => {
  res.send('Working');
});

app.listen(port, () => {
  console.log(`Server is running`);
});