const fs = require('fs');
const http = require('http');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

async function fetchAndWrite(urls) {
  const fetchPromises = urls.map((url, index) => {
    return new Promise((resolve, reject) => {
      http.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', async () => {
          const fileName = `page${index + 1}.html`;
          await writeFileAsync(fileName, data);
          console.log(`Fetched ${url} and wrote to ${fileName}`);
          resolve();
        });
      }).on('error', (error) => {
        console.error(`Error fetching ${url}: ${error.message}`);
        reject();
      });
    });
  });

  await Promise.all(fetchPromises);
  console.log('All pages fetched and written.');
}

async function main() {
  try {
    const urls = fs.readFileSync('urls.txt', 'utf-8').split('\n').filter(Boolean);
    await fetchAndWrite(urls);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
