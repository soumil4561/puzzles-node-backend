const handleImages = async (req) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (data) => {
          chunks.push(data);
        });
        req.on('end', () => {
          const payload = Buffer.concat(chunks).toString();
          resolve(payload);
        });
        req.on('error', reject);
      });
}

module.exports = {handleImages};