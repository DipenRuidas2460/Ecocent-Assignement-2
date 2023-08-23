# Ecocent-Assignement-2

const fs = require('fs');
const http = require('http');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
This code segment imports the required Node.js modules: fs for file system operations, http for making HTTP requests, and promisify from the util module to convert callback-based functions into promise-based functions.

fetchAndWrite Function:

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
This function, fetchAndWrite, takes an array of URLs as input. It maps over each URL to create a promise for fetching and writing content. For each URL, it creates an HTTP GET request using http.get(). It accumulates the response data in the data variable as chunks are received. Once the entire response has been received ('end' event), it writes the data to a file named based on the index (page1.html, page2.html, etc.), using the promise-based writeFileAsync function.

In case of an error during the HTTP request ('error' event), it logs an error message.

After all promises for fetching and writing content have been created, it uses Promise.all to wait for all promises to resolve, ensuring all URLs are fetched and written.

main Function:

async function main() {
  try {
    const urls = fs.readFileSync('urls.txt', 'utf-8').split('\n').filter(Boolean);
    await fetchAndWrite(urls);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
The main function reads the URLs from a file named urls.txt, splits them into an array, and filters out any empty lines. It then calls the fetchAndWrite function with the array of URLs. If an error occurs during reading or fetching, it logs an error message.

main() Invocation:
The last line of the code calls the main function, starting the process of fetching and writing the content of the URLs.
When you run this script, it reads the URLs from the urls.txt file, fetches the content of each URL concurrently, and writes the content to separate HTML files named page1.html, page2.html, and so on.