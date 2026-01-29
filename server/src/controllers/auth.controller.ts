import type { Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config/index.js';
import { authService } from '../services/auth.service.js';
import type { OAuthProvider } from '../types/index.js';

// Configure Google Strategy
if (config.google.clientId && config.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          const userInfo = {
            provider: 'google' as OAuthProvider,
            providerId: profile.id,
            email,
            displayName: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value,
          };

          const tokens = await authService.handleOAuthLogin(userInfo);
          done(null, tokens as any);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

export const initiateGoogleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

export const googleCallback = (req: Request, res: Response) => {
  passport.authenticate('google', { session: false }, (err, tokens) => {
    if (err || !tokens) {
      console.error('Google auth error:', err);
      return res.redirect(
        `${config.frontendUrl}/auth/error?message=${encodeURIComponent(
          err?.message || 'Authentication failed'
        )}`
      );
    }

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with access token
    res.redirect(
      `${config.frontendUrl}/auth/callback?token=${tokens.accessToken}`
    );
  })(req, res);
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const tokens = await authService.refreshTokens(token);

    // Update refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: tokens.accessToken,
      user: tokens.user,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.logout(req.user!.id, refreshToken);

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.user!.id);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// Development-only: Login without OAuth for testing
export const devLogin = async (req: Request, res: Response) => {
  if (config.env !== 'development') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const tokens = await authService.handleOAuthLogin({
      provider: 'google',
      providerId: `dev-${email}`,
      email,
      displayName: email.split('@')[0],
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: tokens.accessToken,
      user: tokens.user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
