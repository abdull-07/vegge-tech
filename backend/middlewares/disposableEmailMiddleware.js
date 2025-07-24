import { isAllowedEmail, isDisposableEmail } from '../utils/disposableEmailChecker.js';
import validator from 'validator';

/**
 * Middleware to check for allowed email addresses (Gmail, Outlook, Yahoo only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const checkDisposableEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Skip if no email provided (will be caught by other validation)
        if (!email) {
            return next();
        }

        // Basic email format validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Check if email domain is allowed
        if (!isAllowedEmail(email)) {
            console.log(`Blocked non-allowed email attempt: ${email}`);
            return res.status(400).json({
                success: false,
                message: 'Temp'
            });
        }

        // Email is allowed, continue to next middleware
        next();
    } catch (error) {
        console.error('Email domain check error:', error);
        // In case of error, block the request for security
        return res.status(500).json({
            success: false,
            message: 'Email validation failed. Please try again.'
        });
    }
};

/**
 * Middleware specifically for registration route
 * Strict checking - only allows Gmail, Outlook, and Yahoo
 */
export const checkDisposableEmailStrict = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();
        
        // Basic format validation
        if (!validator.isEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Extract domain for logging
        const domain = normalizedEmail.split('@')[1];

        // Check for obvious fake patterns
        const fakePatterns = [
            /^test@/i,
            /^fake@/i,
            /^dummy@/i,
            /^sample@/i,
            /^example@/i,
            /^noreply@/i,
            /^donotreply@/i
        ];

        for (const pattern of fakePatterns) {
            if (pattern.test(normalizedEmail)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid personal email address'
                });
            }
        }

        // Main check - only allow Gmail, Outlook, and Yahoo
        if (!isAllowedEmail(normalizedEmail)) {
            console.log(`Blocked non-allowed email registration attempt: ${normalizedEmail} (domain: ${domain})`);
            return res.status(400).json({
                success: false,
                message: 'Temporary or disposable email addresses are not allowed. Please use a permanent, valid email.'
            });
        }

        // Update request with normalized email
        req.body.email = normalizedEmail;
        
        console.log(`Allowed email registration: ${normalizedEmail} (domain: ${domain})`);
        
        // Email passed all checks, continue
        next();
    } catch (error) {
        console.error('Strict email domain check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Email validation failed. Please try again.'
        });
    }
};

/**
 * Middleware for login route
 * Also enforces Gmail, Outlook, and Yahoo restriction for consistency
 */
export const checkDisposableEmailLogin = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();
        
        // Basic format validation
        if (!validator.isEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Check if email domain is allowed (same as registration for consistency)
        if (!isAllowedEmail(normalizedEmail)) {
            const domain = normalizedEmail.split('@')[1];
            console.log(`Blocked non-allowed email login attempt: ${normalizedEmail} (domain: ${domain})`);
            return res.status(400).json({
                success: false,
                message: 'Temporary or disposable email addresses are not allowed. Please use a permanent, valid email.'
            });
        }

        req.body.email = normalizedEmail;
        next();
    } catch (error) {
        console.error('Login email check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Email validation failed. Please try again.'
        });
    }
};