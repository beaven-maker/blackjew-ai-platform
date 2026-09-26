# Blackjew Consultants — Production Deployment

Recommended hosting: Render Web Service.

## 1. Prepare the code
Put this project into a GitHub repository.

## 2. Deploy to Render
In Render:
New -> Web Service -> connect the GitHub repository.

Use:
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`

Render supports Node/Express web services and automatically deploys new commits when the repository is connected. citeturn0search12

## 3. Environment variables
Add these in Render:
- `OPENAI_API_KEY` = your private OpenAI API key
- `OPENAI_MODEL` = `gpt-5.6`
- `VECTOR_STORE_ID` = optional vector store ID containing approved Blackjew documents

Never put the OpenAI API key into public JavaScript.

## 4. Add the domain
In the Render service:
Settings -> Custom Domains -> Add Custom Domain.

Add:
- `blackjewconsultants.co.za`
- `www.blackjewconsultants.co.za`

Render supports custom domains and automatically provisions/renews TLS certificates. citeturn0search0

## 5. GoDaddy DNS
In GoDaddy:
Domain Portfolio -> blackjewconsultants.co.za -> DNS.

Render will display the exact DNS records for your service. Use those records rather than guessing.

For `www`, Render's documentation uses a CNAME pointing to the service's `onrender.com` hostname. citeturn0search1

If Render instructs you to use the standard root-domain A record, its current documentation lists `216.24.57.1` for the root domain when the DNS provider does not support ALIAS/ANAME. citeturn0search1

GoDaddy's DNS interface is:
Domain Portfolio -> domain -> DNS -> Add New Record. citeturn0search6turn0search14

IMPORTANT:
Do not delete or change email MX, SPF, DKIM or DMARC records unless you know exactly what your email provider requires. Changing DNS A/CNAME records can affect website routing, while email records control mail delivery.

## 6. Verify
Return to Render and click Verify for the custom domain. Once verified, Render issues the TLS certificate. citeturn0search0

## 7. Production lead storage
The current development version writes enquiries to a local JSONL file. For production, connect the enquiry endpoint to a persistent database or CRM so leads are retained across deploys/restarts.

## 8. Knowledge base
Create an OpenAI vector store and upload:
- Company profile
- Vision and mission
- Services
- Consulting packages
- Approved FAQs
- Approved company documents

Then set `VECTOR_STORE_ID` in Render.
