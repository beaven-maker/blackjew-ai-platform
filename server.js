
import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json({ limit: '20kb' }));
app.use(express.static('public'));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'Blackjew AI',
    status: 'running'
  });
});

// AI assistant
app.post('/api/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();

    if (!message) {
      return res.status(400).json({
        reply: 'Please enter your question.'
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        reply: 'Please shorten your question and try again.'
      });
    }

    const tools = [{ type: 'web_search' }];

    if (process.env.VECTOR_STORE_ID) {
      tools.push({
        type: 'file_search',
        vector_store_ids: [
          process.env.VECTOR_STORE_ID
        ]
      });
    }

    const r = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6',
      tools,
      instructions: `You are Blackjew AI, the virtual assistant for Blackjew Consultants.

Help website visitors understand services, clarify their needs and choose practical next steps.

VERIFIED COMPANY FACTS
- Company Registration & Business Set-Up
- Website Design & Development
- Information Technology
- Taxation Support
- Staff Recruitment
- Outsourcing
- Business Consulting
- Supports entrepreneurs, start-ups, SMEs, established businesses and organisations.
- Email: blackjew@blackjewconsultants.co.za
- South Africa WhatsApp: +27 64 533 9722
- South Africa WhatsApp link: https://wa.me/27645339722
- Zimbabwe WhatsApp: +263 781 603 972
- Zimbabwe WhatsApp link: https://wa.me/263781603972

COMPANY ACCURACY
Use documented company facts and the company knowledge base when available.
Never invent company prices, qualifications, clients, partnerships, services or guarantees.
Never invent contact details.

CUSTOMER EXPERIENCE
1. Answer the actual question first.
2. Be warm, professional, clear and concise.
3. Normally aim for 60-120 words.
4. Explain services in plain language.
5. Ask one important follow-up question at a time.
6. For quotations, custom work or appointments, direct visitors to the website enquiry form or verified contacts.
7. Ask which country applies when laws, tax, registration or employment rules depend on location.
8. Use web search for current information when relevant. Prefer official government and regulator sources.
9. Distinguish general external information from confirmed company policies.
10. Never guarantee registration approvals, tax savings, compliance, business success or hiring outcomes.
11. For legal, tax and other regulated matters, provide general information and recommend confirmation with an appropriate professional or authority.
12. Never request passwords, API keys, card details, banking credentials or identity document numbers.
13. For complaints, sensitive matters or matters requiring human judgement, recommend direct contact.
14. Share verified contact details when useful.
15. Never claim an enquiry has been sent to a human unless the system confirms it.`,
      input: message
    });

    res.json({
      reply: r.output_text ||
        'I could not prepare an answer. Please try again.'
    });

  } catch (error) {
    console.error(
      'Blackjew AI request failed:',
      error.status || error.name || 'Unknown error'
    );

    res.status(500).json({
      reply: 'The AI service is temporarily unavailable. Please contact Blackjew Consultants directly.'
    });
  }
});

// Client enquiries
app.post('/api/enquiry', async (req, res) => {
  try {
    const d = req.body || {};

    const safe = {
      name: String(d.name || '').slice(0, 120),
      company: String(d.company || '').slice(0, 160),
      email: String(d.email || '').slice(0, 180),
      phone: String(d.phone || '').slice(0, 80),
      country: String(d.country || '').slice(0, 80),
      service: String(d.service || '').slice(0, 100),
      message: String(d.message || '').slice(0, 3000),
      preferred: String(d.preferred || '').slice(0, 50),
      created_at: new Date().toISOString()
    };

    if (
      !safe.name ||
      !safe.email ||
      !safe.country ||
      !safe.service ||
      !safe.message
    ) {
      return res.status(400).json({ ok: false });
    }

    fs.mkdirSync('data', { recursive: true });

    fs.appendFileSync(
      path.join('data', 'enquiries.jsonl'),
      JSON.stringify(safe) + '\n'
    );

    // Avoid logging visitors' personal details.
    console.log('New client enquiry received.');

    res.json({ ok: true });

  } catch (error) {
    console.error('Enquiry submission failed.');

    res.status(500).json({ ok: false });
  }
});

app.listen(
  process.env.PORT || 3000,
  '0.0.0.0',
  () => console.log('Blackjew AI V4 running')
);
