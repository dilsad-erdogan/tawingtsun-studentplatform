const { openAsBlob } = require('fs');
const path = require('path');

async function probeLocal() {
    try {
        const form = new FormData();
        const blob = new Blob(['test'], { type: 'text/plain' });
        form.append('file', blob, 'test.txt');

        console.log('Probing http://localhost:5000/api/upload ...');
        const response = await fetch('http://localhost:5000/api/upload', {
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

probeLocal();
