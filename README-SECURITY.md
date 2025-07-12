# 🔒 Security Guidelines for LemonSqueezy Integration

## ⚠️ Important Security Notes

### 1. Environment Variables
- **NEVER** commit `.env.local` file to Git
- **ALWAYS** use environment variables for sensitive data
- Keep your API keys secure and rotate them regularly

### 2. Helper Scripts
The following helper scripts require environment variables to work:
- `get-store-id.js` - needs `LEMONSQUEEZY_API_KEY`
- `check-webhooks.js` - needs `LEMONSQUEEZY_API_KEY` 
- `get-products.js` - needs `LEMONSQUEEZY_API_KEY` and `LEMONSQUEEZY_STORE_ID`
- `create-webhook.js` - needs `LEMONSQUEEZY_API_KEY` and `LEMONSQUEEZY_STORE_ID`

### 3. How to use helper scripts safely:

#### Option 1: Load from .env.local
```bash
# Make sure you have .env.local with your credentials
node -r dotenv/config get-products.js
```

#### Option 2: Set environment variables temporarily
```bash
export LEMONSQUEEZY_API_KEY="your-api-key-here"
export LEMONSQUEEZY_STORE_ID="your-store-id-here"
node get-products.js
```

### 4. SQL Scripts
Before running `supabase-subscriptions.sql`:
1. Replace `YOUR_CASUAL_PRODUCT_ID` with your actual Product ID
2. Replace `YOUR_CASUAL_VARIANT_ID` with your actual Variant ID
3. Replace `YOUR_GIGACHAD_PRODUCT_ID` with your actual Product ID
4. Replace `YOUR_GIGACHAD_VARIANT_ID` with your actual Variant ID

### 5. Files to NEVER commit to Git:
- `.env.local` - Contains API keys
- Any file with hardcoded credentials
- Database backups with user data
- Log files that might contain sensitive information

### 6. Safe to commit:
- `.env.example` - Template without real values
- All source code in `src/` directory
- Helper scripts (now using environment variables)
- SQL scripts (now using placeholders)

### 7. Production Deployment
For production (Vercel, Netlify, etc.):
1. Add all environment variables to your hosting platform
2. Never use development API keys in production
3. Use production webhook URLs
4. Monitor for any exposed credentials in logs

## 🛡️ Security Checklist

Before committing to Git:
- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded API keys in code
- [ ] No hardcoded Product/Variant IDs
- [ ] All helper scripts use environment variables
- [ ] SQL scripts use placeholders

## 🚨 If you accidentally commit sensitive data:
1. Immediately revoke/regenerate the API key in LemonSqueezy
2. Remove the sensitive data from Git history
3. Add the file to `.gitignore`
4. Update all team members about the security incident 