require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({limit:'1mb'}));


const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/gtsdb';
const APP_API_KEY = process.env.API_KEY || 'dev-api-key';


mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=> console.log('Mongo connected'))
.catch(e=> console.error('Mongo connect error', e));


const recordSchema = new mongoose.Schema({
timestamp: {type: Date, default: Date.now},
payload: {type: Object, required:true}
});
const Record = mongoose.model('Record', recordSchema);


function checkApiKey(req, res, next){
const key = req.get('x-api-key');
if (!key || key !== APP_API_KEY) return res.status(401).json({error:'Invalid API Key'});
next();
}


async function verifyOAuthToken(req, res, next){
const auth = req.get('authorization') || '';
if (!auth.startsWith('Bearer ')) return res.status(401).json({error:'Missing Bearer token'});
const token = auth.slice('Bearer '.length).trim();


if (process.env.NODE_ENV !== 'production' && token === 'demo-token'){
req.user = {sub:'demo-user'}; 
return next();
}


return res.status(401).json({error:'Invalid or unverified token (replace middleware with real OAuth verification)'});
}


app.post('/submit-data', checkApiKey, verifyOAuthToken, async (req, res) => {
const payload = req.body;
if (!payload || typeof payload !== 'object') return res.status(400).json({error:'Invalid JSON payload'});


try {
const r = await Record.create({payload});
return res.status(201).json({id: r._id, message:'saved'});
} catch (e) {
	console.error(e);
	return res.status(500).json({error:'Server error'});
}
});

app.get('/', (req, res) => res.json({status: 'ok'}));

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

module.exports = app;