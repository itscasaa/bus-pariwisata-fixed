import { APIRequestContext } from '@playwright/test';

/**
 * Log in to the admin panel with given credentials and return the JWT-like Bearer token.
 */
export async function loginAndGetToken(request: APIRequestContext, baseUrl: string) {
  const response = await request.post(`${baseUrl}/admin/api/login.php`, {
    data: {
      username: 'admin',
      password: 'admin123'
    }
  });
  
  const body = await response.json();
  if (body.status === 'success' && body.data && body.data.token) {
    return body.data.token;
  }
  throw new Error(`Failed to login and get admin token: ${body.message || 'Unknown error'}`);
}

/**
 * Generate a fake JWT-like token (fails HMAC signature check).
 */
export function generateFakeToken(): string {
  // Invalid signature: expected sig will not match
  return 'eyJ1c2VybmFtZSI6ImhhY2tlciIsImV4cCI6MTc4MjUxNzYzNH0=.fakehmacsignature1234567890abcdef';
}

/**
 * Generate an expired JWT-like token (valid signature, but 'exp' is in the past).
 * Expired payload: {"admin_id":2,"username":"admin","exp":1000000000}
 * base64_encode: eyJhZG1pbl9pZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTAwMDAwMDAwMH0=
 * HMAC-SHA256 signature using secret '3f9b2d8e4c1a7e6f9d8c7b6a5f4e3d2c' is:
 * 68b1a45749ee756c66cf1d2d3a223f6630f576e01a8f09eb2c52402b9e6fa4f7
 */
export function generateExpiredToken(): string {
  return 'eyJhZG1pbl9pZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTAwMDAwMDAwMH0=.68b1a45749ee756c66cf1d2d3a223f6630f576e01a8f09eb2c52402b9e6fa4f7';
}
