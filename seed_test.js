const fs = require('fs');

async function run() {
  try {
    // register
    const regRes = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'jane@example.com', password: 'test' })
    });
    const { token, user } = await regRes.json();
    console.log("Registered Jane.");

    // fetch resume to create default
    await fetch('http://localhost:3000/api/resume/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // update resume
    const updateRes = await fetch('http://localhost:3000/api/resume/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Jane Doe",
        bio: "Expert Software Engineer",
        theme: "vibe",
        slug: "jane-vibe",
        links: [{"platform": "GitHub", "url": "https://github.com/jane"}],
        sections: [{
          id: "s1",
          type: "experience",
          title: "Work Experience",
          items: [{
            id: "i1",
            title: "Senior Engineer",
            subtitle: "Tech Corp",
            dateRange: "2020-Present",
            description: "Built cool things."
          }]
        }]
      })
    });
    const updateData = await updateRes.json();
    console.log("Updated Jane's Resume:", updateData.slug);

    // fetch public
    const pubRes = await fetch('http://localhost:3000/api/resume/public/jane-vibe');
    const pubData = await pubRes.json();
    console.log("Public Data views:", pubData.views);

  } catch (err) {
    console.error("Error:", err);
  }
}
run();
