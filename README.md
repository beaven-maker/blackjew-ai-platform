# Blackjew AI Platform V4

Adds:
- Seven Blackjew services
- AI chat
- Current web research
- Optional Blackjew document knowledge base
- Structured client enquiry form
- Enquiry storage in data/enquiries.jsonl
- WhatsApp/email human handoff
- Server-side API key

Production recommendation:
Use a persistent database/CRM instead of local JSONL storage. Keep the OpenAI key private as a hosting environment variable.

Setup:
npm install
copy .env.example to .env
set OPENAI_API_KEY
npm start

Domain:
Deploy to Node-compatible hosting, then connect blackjewconsultants.co.za and www.blackjewconsultants.co.za using the DNS records supplied by the host. Preserve email MX/SPF/DKIM/DMARC records.


Recommended production host: Render. See PRODUCTION-DEPLOYMENT.md and render.yaml.
