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
  private pendingSignIn: Promise<GoogleUser> | null = null;
  private signInResolver: ((user: GoogleUser) => void) | null = null;
  private signInRejecter: ((error: Error) => void) | null = null;

  constructor() {
    // Use environment variable if available, otherwise use the hardcoded client ID
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID;
    
    // Debug: Log the client ID (masked for security)
    if (this.clientId) {
      console.log('✅ Google Client ID loaded:', this.clientId.substring(0, 12) + '...');
    } else {
      console.error('⚠️ No Google Client ID found!');
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

  // Handle credential response - called by Google
  private handleCredentialResponse = (response: any) => {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }
      
      // Decode JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      if (!payload.sub || !payload.email) {
        throw new Error('Invalid user data received from Google');
      }
      
      const user: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name || payload.email,
        picture: payload.picture || '',
        credential: response.credential
      };
      
      console.log('✅ Google sign-in successful:', user.email);
      
      // If there's a pending sign-in promise, resolve it
      if (this.signInResolver) {
        this.signInResolver(user);
        this.cleanupPending();
      } else {
        // If button was rendered directly (no signIn() call), dispatch custom event
        // This allows components to listen for Google auth completion
        const event = new CustomEvent('google-auth-success', { detail: user });
        window.dispatchEvent(event);
        console.log('📢 Dispatched google-auth-success event (no pending sign-in)');
      }
    } catch (error) {
      console.error('❌ Failed to decode Google token:', error);
      if (this.signInRejecter) {
        this.signInRejecter(new Error(`Google authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        this.cleanupPending();
      } else {
        // Dispatch error event if no pending sign-in
        const event = new CustomEvent('google-auth-error', { 
          detail: { error: error instanceof Error ? error.message : 'Unknown error' } 
        });
        window.dispatchEvent(event);
      }
    }
  };

  // Initialize Google API - only called ONCE
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Validate client ID before proceeding
    this.validateClientId();

    return new Promise((resolve, reject) => {
      // Check if script already loaded
      if (window.google?.accounts?.id) {
        this.initializeGoogleIdentity();
        resolve();
        return;
      }

      // Load Google API script
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        // Wait for it to load
        existingScript.addEventListener('load', () => {
          this.initializeGoogleIdentity();
          resolve();
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.initializeGoogleIdentity();
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  private initializeGoogleIdentity() {
    if (this.isInitialized || !window.google) return;
    
    try {
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, // Disable FedCM to avoid the errors
      });
      this.isInitialized = true;
      console.log('✅ Google Auth initialized successfully');
    } catch (error) {
      console.error('❌ Google Auth initialization failed:', error);
      throw error;
    }
  }

  // Sign in with Google - directly triggers Google's native popup
  async signIn(): Promise<GoogleUser> {
    // If there's already a pending sign-in, return that promise
    if (this.pendingSignIn) {
      console.log('⏳ Sign-in already in progress, waiting...');
      return this.pendingSignIn;
    }

    try {
      await this.initialize();

      this.pendingSignIn = new Promise((resolve, reject) => {
        this.signInResolver = resolve;
        this.signInRejecter = reject;

        if (!window.google) {
          reject(new Error('Google API not loaded'));
          this.pendingSignIn = null;
          return;
        }

        // Directly trigger Google's sign-in button click programmatically
        // This will open Google's native popup window
        const buttonElement = document.createElement('div');
        buttonElement.style.display = 'none';
        document.body.appendChild(buttonElement);

        // Render Google button invisibly and click it
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
        });

        // Wait a moment for button to render, then click it
        setTimeout(() => {
          const googleButton = buttonElement.querySelector('div[role="button"]') as HTMLElement;
          if (googleButton) {
            googleButton.click();
          } else {
            // Fallback: trigger One Tap prompt
            window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // If One Tap doesn't work, create a temporary visible button
                this.createTemporaryButton(resolve, reject);
              } else if (notification.isDismissedMoment()) {
                reject(new Error('Sign-in was dismissed'));
                this.cleanupPending();
              }
            });
          }
          document.body.removeChild(buttonElement);
        }, 100);

        // Timeout after 60 seconds
        setTimeout(() => {
          if (this.signInRejecter) {
            this.signInRejecter(new Error('Sign-in timed out'));
            this.cleanupPending();
          }
        }, 60000);
      });

      return this.pendingSignIn;
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      this.pendingSignIn = null;
      throw error;
    }
  }

  private cleanupPending() {
    this.signInResolver = null;
    this.signInRejecter = null;
    this.pendingSignIn = null;
  }

  private createTemporaryButton(resolve: (user: GoogleUser) => void, reject: (error: Error) => void) {
    // Create a temporary button that will trigger Google's popup
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '-1000px';
    tempContainer.style.left = '-1000px';
    tempContainer.style.visibility = 'hidden';
    document.body.appendChild(tempContainer);

    window.google.accounts.id.renderButton(tempContainer, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'signin_with',
    });

    setTimeout(() => {
      const button = tempContainer.querySelector('div[role="button"]') as HTMLElement;
      if (button) {
        button.click();
      }
      setTimeout(() => document.body.removeChild(tempContainer), 1000);
    }, 100);
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