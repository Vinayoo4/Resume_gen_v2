const fs = require('fs');
const http = require('http');

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test3@example.com', password: 'test' })
    });
    const data = await res.json();
    console.log("Register response:", data);
  } catch (err) {
    console.error("Error in register:", err);
  }
}
run();
