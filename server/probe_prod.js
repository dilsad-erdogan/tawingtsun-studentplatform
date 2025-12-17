const { openAsBlob } = require('fs');
const path = require('path');

async function probe() {
    try {
        const filePath = path.join(__dirname, '../src/assets/logo.png');
        const form = new FormData();
        // We need a dummy file
        const blob = new Blob(['test'], { type: 'text/plain' });
        form.append('file', blob, 'test.txt');

        console.log('Probing https://taccounting.online/api/upload ...');
        const response = await fetch('https://taccounting.online/api/upload', {
            method: 'POST',
            body: form
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers.get('content-type'));
        console.log('Body Peek:', text.substring(0, 200));

    } catch (error) {
        console.error('Probe error:', error);
    }
}

probe();
