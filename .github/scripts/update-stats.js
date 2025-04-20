const fs = require('fs');

const stats = JSON.parse(fs.readFileSync('stats.json', 'utf8'));

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/id="serversCount" data-count="(\d+)"/g, `id="serversCount" data-count="${stats.servers_protected}"`);
html = html.replace(/id="backupsCount" data-count="(\d+)"/g, `id="backupsCount" data-count="${stats.backups_created}"`);
html = html.replace(/id="dataSavedCount" data-count="(\d+)"/g, `id="dataSavedCount" data-count="${stats.data_saved_gb}"`);

fs.writeFileSync('index.html', html);

console.log('Updated index.html with latest stats');
