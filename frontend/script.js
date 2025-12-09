const BACKEND_URL = 'http://localhost:4000';
const API_KEY = 'YOUR_APP_API_KEY_HERE'; 
const OAUTH_BEARER = 'USER_OAUTH_ACCESS_TOKEN_HERE'; 


const countryInput = document.getElementById('countryInput');
const searchBtn = document.getElementById('searchBtn');
const dashboard = document.getElementById('dashboard');
const saveBtn = document.getElementById('saveBtn');


searchBtn.addEventListener('click', () => {
const country = countryInput.value.trim();
if (!country) return alert('Please enter a country name');
runDashboard(country);
});


saveBtn.addEventListener('click', async () => {
if (!window.latestAggregated) return alert('No data to save');
try {
const res = await fetch(BACKEND_URL + '/submit-data', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': 'Bearer ' + OAUTH_BEARER,
'x-api-key': API_KEY,
},
body: JSON.stringify(window.latestAggregated)
});
const data = await res.json();
if (res.ok) alert('Saved successfully (id: ' + data.id + ')');
else alert('Save failed: ' + (data.error || JSON.stringify(data)));
} catch (e) {
console.error(e);
alert('Error saving data: ' + e.message);
}
});


async function runDashboard(country) {
dashboard.innerHTML = '<div class="card">Loading...</div>';


const restCountriesUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=false`;
const covidUrl = `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}?strict=true`;
const travelAdvUrl = `https://www.travel-advisory.info/api?countrycode=`; // requires country code from RestCountries


const OPENWEATHER_KEY = 'YOUR_OPENWEATHER_KEY';


try {
const rc = await fetch(restCountriesUrl);
if (!rc.ok) throw new Error('Country not found');
const rcJson = await rc.json();
const cr = rcJson[0];


const countryInfo = {
name: cr.name.common,
official: cr.name.official,
capital: Array.isArray(cr.capital) ? cr.capital[0] : cr.capital,
population: cr.population,
currencies: cr.currencies ? Object.keys(cr.currencies) : [],
flag: cr.flags && (cr.flags.svg || cr.flags.png),
};

window.latestAggregated = { country: countryInfo };
dashboard.innerHTML = `
  <div class="card">
	<h2>${countryInfo.name}</h2>
	<p>Capital: ${countryInfo.capital || 'N/A'}</p>
	<p>Population: ${countryInfo.population ? countryInfo.population.toLocaleString() : 'N/A'}</p>
	<p>Currencies: ${countryInfo.currencies.length ? countryInfo.currencies.join(', ') : 'N/A'}</p>
	${countryInfo.flag ? `<img src="${countryInfo.flag}" alt="flag" style="width:120px;margin-top:8px;">` : ''}
  </div>
`;

} catch (err) {
console.error(err);
dashboard.innerHTML = '<div class="card">Error: ' + (err.message || err) + '</div>';
}
}