const Groq = require('groq-sdk');
require('dotenv').config();

async function testGroqConnection() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error('❌ No GROQ_API_KEY found in .env');
        process.exit(1);
    }

    try {
        console.log('Testing connection to Groq API...');
        const groq = new Groq({ apiKey });

        const modelsToTest = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
        
        for (const m of modelsToTest) {
            try {
                console.log(`Checking model: ${m}...`);
                const completion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: 'Say hello and tell me you are running Llama 3!' }],
                    model: m,
                });
                console.log(`✅ Model ${m} is working!`);
                console.log(`Reply: "${completion.choices[0]?.message?.content.trim()}"\n`);
            } catch (err) {
                console.log(`❌ Model ${m} failed: ${err.message}\n`);
            }
        }
        console.log('Test completed.');
    } catch (err) {
        console.error('Fatal connection error:', err.message);
    }
}

testGroqConnection();
