const https = require('https');

const supabaseUrl = 'https://ztozevcqkfrohgjmngcj.supabase.co';
const supabaseKey = 'sb_publishable_5XI7rHUasA9ssbnix_qEvQ_7K0GgeXG';

const options = {
  hostname: 'ztozevcqkfrohgjmngcj.supabase.co',
  path: '/rest/v1/global_plans?select=*',
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
      console.log("Global plans count:", json.length);
      json.forEach(p => {
        console.log(`- ID: ${p.id}, Key: ${p.preset_key}, Name: ${p.name}, Kind: ${p.plan_kind}, Hidden: ${p.is_hidden}`);
      });
    } catch (e) {
      console.error("Failed to parse response:", data);
    }
  });
}).on('error', (err) => {
  console.error("Error fetching data:", err);
});
