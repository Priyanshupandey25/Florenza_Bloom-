import ImageKit from '@imagekit/nodejs';

// Initialize ImageKit client
const client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// Function to upload a file to ImageKit
export async function uploadFile({buffer, fileName, folder = "Florenza_Bloom"}) {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}