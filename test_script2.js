const fs = require('fs');

async function testStorage() {
  try {
    const { JsonStorage } = await import('./backend/src/storage/index.js');
    console.log("imported")
  } catch (err) {
    console.error("error", err);
  }
}
testStorage()
