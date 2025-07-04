// Google OAuth Authentication Service
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  credential?: string;
}

// Set the Google OAuth client ID to the provided value
const GOOGLE_CLIENT_ID = '957446722705-e3g6jaj8mfq3n5dfj6cachhnn4dvr08k.apps.googleusercontent.com';

class GoogleAuthService {
  private clientId: string;
  private isInitialized: boolean = false;

  constructor() {
    // Debug all Vite environment variables
    console.log('🔍 All import.meta.env:', import.meta.env);
    console.log('🔍 VITE_GOOGLE_CLIENT_ID from env:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    
    // Use the provided client ID
    this.clientId = GOOGLE_CLIENT_ID;
    
    // Debug: Log the client ID (masked for security)
    if (this.clientId) {
      console.log('Google Client ID loaded:', this.clientId.substring(0, 10) + '...');
    } else {
      console.error('⚠️ VITE_GOOGLE_CLIENT_ID not found in environment variables');
      console.log('Available env vars:', Object.keys(import.meta.env));
    }
  }

  // Check if client ID is configured
  private validateClientId(): void {
    if (!this.clientId || this.clientId === 'your_google_client_id_here.apps.googleusercontent.com') {
      throw new Error(
        '🔐 Google Client ID not configured!\n\n' +
        '1. Go to: https://console.cloud.google.com/\n' +
        '2. Create OAuth 2.0 credentials\n' +
        '3. Add to .env.local: VITE_GOOGLE_CLIENT_ID=your_real_client_id\n' +
        '4. Restart your dev server\n\n' +
        'Current value: ' + this.clientId
      );
    }
  }

  // Initialize Google API
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Validate client ID before proceeding
    this.validateClientId();

    return new Promise((resolve, reject) => {
      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        // Initialize Google Identity Services
        if (window.google) {
          try {
            window.google.accounts.id.initialize({
              client_id: this.clientId,
              callback: this.handleCredentialResponse.bind(this),
            });
            this.isInitialized = true;
            console.log('✅ Google Auth initialized successfully');
            resolve();
          } catch (error) {
            console.error('❌ Google Auth initialization failed:', error);
            reject(error);
          }
        } else {
          reject(new Error('Google API failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  // Handle Google OAuth response
  private handleCredentialResponse(response: any) {
    // This will be called automatically by Google
    // The actual handling is done in the signIn method
  }

  // Sign in with Google
  async signIn(): Promise<GoogleUser> {
    try {
      await this.initialize();

      return new Promise((resolve, reject) => {
        if (!window.google) {
          reject(new Error('Google API not loaded'));
          return;
        }

        // Show Google Sign-In prompt
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to popup
            this.signInWithPopup().then(resolve).catch(reject);
          }
        });

        // Set up credential response handler
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: (response: any) => {
            try {
              // Decode JWT token
              const payload = JSON.parse(atob(response.credential.split('.')[1]));
              const user: GoogleUser = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                credential: response.credential // Include the credential token
              };
              console.log('✅ Google sign-in successful:', user.email);
              resolve(user);
            } catch (error) {
              console.error('❌ Failed to decode Google token:', error);
              reject(error);
            }
          },
        });
      });
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      throw error;
    }
  }

  // Fallback popup method
  private async signInWithPopup(): Promise<GoogleUser> {
    return new Promise((resolve, reject) => {
      // Create OAuth URL
      const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      const params = new URLSearchParams({
        client_id: this.clientId,
        redirect_uri: window.location.origin + '/auth/google/callback',
        response_type: 'code',
        scope: 'openid email profile',
        state: Math.random().toString(36).substring(7),
      });

      const authUrl = `${oauth2Endpoint}?${params}`;
      
      // Open popup window
      const popup = window.open(
        authUrl,
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Check for popup completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);

      // Listen for message from popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup?.close();
          window.removeEventListener('message', messageHandler);
          resolve(event.data.user);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup?.close();
          window.removeEventListener('message', messageHandler);
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageHandler);
    });
  }

  // Render Google Sign-In button
  renderButton(element: HTMLElement, options: any = {}) {
    this.initialize().then(() => {
      if (window.google) {
        window.google.accounts.id.renderButton(element, {
          theme: options.theme || 'outline',
          size: options.size || 'large',
          type: options.type || 'standard',
          text: options.text || 'signin_with',
          shape: options.shape || 'rectangular',
          logo_alignment: options.logo_alignment || 'left',
          width: options.width || 250,
        });
      }
    }).catch(error => {
      console.error('Failed to render Google button:', error);
      // Show error in element
      element.innerHTML = `
        <div style="padding: 10px; border: 2px dashed #ff6b6b; border-radius: 8px; color: #d63031; text-align: center;">
          <strong>⚠️ Google Auth Setup Required</strong><br>
          <small>Add VITE_GOOGLE_CLIENT_ID to .env.local</small>
        </div>
      `;
    });
  }

  // Get user info from token
  async getUserInfo(accessToken: string): Promise<GoogleUser> {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    const data = await response.json();
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture
    };
  }

  // Sign out
  async signOut(): Promise<void> {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  // Get current client ID (for debugging)
  getClientId(): string {
    return this.clientId;
  }
}

// Global Google types
declare global {
  interface Window {
    google: any;
  }
}

export const googleAuth = new GoogleAuthService(); 