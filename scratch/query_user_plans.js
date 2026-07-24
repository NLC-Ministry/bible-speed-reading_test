const https = require('https');

const supabaseUrl = 'https://ztozevcqkfrohgjmngcj.supabase.co';
const supabaseKey = 'sb_publishable_5XI7rHUasA9ssbnix_qEvQ_7K0GgeXG';

const options = {
  hostname: 'ztozevcqkfrohgjmngcj.supabase.co',
  path: '/rest/v1/reading_plans?select=*',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("Reading plans count:", json.length);
      json.forEach(p => {
        console.log(`- ID: ${p.id}, UserID: ${p.user_id}, Name: ${p.name}, PresetKey: ${p.preset_key}, EndDate: ${p.end_date}`);
      });
    } catch (e) {
      console.error("Failed to parse response:", data);
    }
  });
}).on('error', (err) => {
  console.error("Error fetching data:", err);
});
