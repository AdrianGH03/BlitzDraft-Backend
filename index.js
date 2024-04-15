const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const leaguepediaRoutes = require('./routes/enableRoutes/leaguepediaRoutes');
const riotAPIRoutes = require('./routes/enableRoutes/riotAPIRoutes');
const authRoutes = require('./routes/authentication/authRoutes');
const userRoutes = require('./routes/enableRoutes/userRoutes');
const passRoutes = require('./routes/authentication/changePass');
const gameRoutes = require('./routes/enableRoutes/gameRoutes');
const checkRoutes = require('./routes/authentication/checkAuth');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@loldraftsim.hm2uwm5.mongodb.net/?retryWrites=true&w=majority&appName=LolDraftSim`;

app.set('trust proxy', 1);

app.use(express.json());
app.use(helmet());
require('dotenv').config();
app.use(cookieParser());


const corsOptions = {
  origin: ['https://blitz-draft.vercel.app', 'http://localhost:5173'],
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

app.use(express.static('public'));

mongoose.connect(uri, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});


app.use('/auth', authRoutes);
app.use('/check', checkRoutes)
app.use('/account', passRoutes);
gameRoutes(app);
leaguepediaRoutes(app);
riotAPIRoutes(app);
userRoutes(app);

app.get('/', (req, res) => {
    res.send('Yoo this bih is working!');
});




app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});