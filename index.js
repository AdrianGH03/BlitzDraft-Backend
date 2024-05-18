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
const gameRoutes = require('./routes/enableRoutes/gameRoutes');
const statsRoutes = require('./routes/enableRoutes/statsRoutes');

const uri = `mongodb+srv://${process.env.DB_USER2}:${process.env.DB_PASSWORD2}@loldraftsim.hm2uwm5.mongodb.net/?retryWrites=true&w=majority&appName=LolDraftSim`;
const uri2 = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@blitzdraft.wsv38m3.mongodb.net/?retryWrites=true&w=majority&appName=BlitzDraft`;
app.set('trust proxy', 1);

app.use(express.json());
app.use(helmet());

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


gameRoutes(app);
leaguepediaRoutes(app);
riotAPIRoutes(app);
statsRoutes(app);


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});