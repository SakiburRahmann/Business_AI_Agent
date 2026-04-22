/**
 * Vapi Voice AI Integration
 * Initialized with credentials for sub-100ms conversational voice.
 */
export const VAPI_CONFIG = {
  apiKey: process.env.VAPI_API_KEY || '',
  baseUrl: 'https://api.vapi.ai',
};

export async function createVapiCall(options: any) {
  const response = await fetch(`${VAPI_CONFIG.baseUrl}/call`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VAPI_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
  return response.json();
}
