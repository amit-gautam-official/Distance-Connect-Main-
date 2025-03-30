# Getting Your Gemini API Key

To use the AI Career Counselor in this application, you need to obtain a Gemini API key from Google. Follow these steps:

1. Go to the Google AI Studio: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click on "Create API Key"
4. Copy the generated API key
5. Paste it in your project's `.env` file:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

## Usage Limits

- The free tier of Gemini API allows for a limited number of requests per minute
- For production use, consider upgrading to a paid tier
- More information on pricing: https://ai.google.dev/pricing

## Documentation

For more information on customizing the Gemini AI model:
- Gemini API documentation: https://ai.google.dev/docs
- Google Generative AI client library: https://www.npmjs.com/package/@google/generative-ai 