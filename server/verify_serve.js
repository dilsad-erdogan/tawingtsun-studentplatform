const { openAsBlob } = require('fs');
const path = require('path');

async function testStart() {
    try {
        const filePath = path.join(__dirname, '../src/assets/logo.png');
        // Upload
        const blob = await openAsBlob(filePath, { type: 'image/png' });
        const form = new FormData();
        form.append('file', blob, 'test-image.png');

        const uploadRes = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: form
        });
        const data = await uploadRes.json();

        if (!uploadRes.ok) {
            console.error('Upload failed:', data);
            return;
        }

        console.log('Uploaded to:', data.filePath);

        // Download
        const imgRes = await fetch(data.filePath);
        if (imgRes.ok) {
            console.log('Download success! Status:', imgRes.status);
            const text = await imgRes.blob();
            console.log('Blob size:', text.size);
        } else {
            console.error('Download failed! Status:', imgRes.status);
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testStart();
