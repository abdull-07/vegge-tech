import validator from 'validator';
import dns from 'dns';

// List of temporary/disposable email domains
const tempEmailDomains = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
    'yopmail.com', 'temp-mail.org', 'throwaway.email', 'maildrop.cc',
    'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
    'tempail.com', 'tempemail.com', 'tempinbox.com', 'throwawaymail.com',
    'trashmail.com', 'dispostable.com', 'emailondeck.com', 'fakeinbox.com',
    'getnada.com', 'harakirimail.com', 'incognitomail.org', 'jetable.org',
    'mailcatch.com', 'mailnesia.com', 'mytrashmail.com', 'no-spam.ws',
    'noclickemail.com', 'nogmailspam.info', 'nomail.xl.cx', 'notmailinator.com',
    'nowmymail.com', 'objectmail.com', 'obobbo.com', 'onewaymail.com',
    'pookmail.com', 'quickinbox.com', 'rcpt.at', 'recode.me', 'recursor.net',
    'regbypass.com', 'rmqkr.net', 'safe-mail.net', 'selfdestructingmail.com',
    'sendspamhere.com', 'shieldedmail.com', 'soodonims.com', 'spambog.com',
    'spambog.de', 'spambog.ru', 'spamex.com', 'spamfree24.org', 'spamgourmet.com',
    'spamgourmet.net', 'spamgourmet.org', 'spamhole.com', 'spamify.com',
    'spammotel.com', 'spaml.com', 'spamspot.com', 'spamthis.co.uk', 'spamthisplease.com',
    'speed.1s.fr', 'superrito.com', 'tempemail.net', 'tempymail.com',
    'thankyou2010.com', 'trash2009.com', 'trashdevil.com', 'trashymail.com',
    'tyldd.com', 'uggsrock.com', 'wegwerfmail.de', 'wegwerfmail.net',
    'wegwerfmail.org', 'wh4f.org', 'whyspam.me', 'willselfdestruct.com',
    'xoxy.net', 'yogamaven.com', 'zoemail.org', '0-mail.com', '0815.ru',
    '0clickemail.com', '0wnd.net', '0wnd.org', '10mail.org', '10minut.com.pl',
    '10x9.com', '123-m.com', '1chuan.com', '1pad.de', '20mail.it',
    '20minutemail.com', '2prong.com', '30minutemail.com', '33mail.com',
    '3d-painting.com', '4warding.com', '4warding.net', '4warding.org',
    '60minutemail.com', '675hosting.com', '675hosting.net', '675hosting.org',
    '6url.com', '75hosting.com', '75hosting.net', '75hosting.org',
    '7tags.com', '9ox.net', 'a-bc.net', 'afrobacon.com', 'ajaxapp.net'
];

// List of fake/suspicious email patterns
const fakeEmailPatterns = [
    /test.*@/i, /fake.*@/i, /dummy.*@/i, /sample.*@/i, /example.*@/i,
    /noreply.*@/i, /donotreply.*@/i, /admin.*@/i, /info.*@/i,
    /^[a-z]{1,3}@/i, // Very short usernames
    /^\d+@/i, // Only numbers as username
    /^[a-z]+\d{4,}@/i // Simple pattern + many numbers
];

/**
 * Validates email format and checks for temporary/fake emails
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateEmail = async (email) => {
    try {
        // Basic format validation
        if (!validator.isEmail(email)) {
            return {
                isValid: false,
                message: 'Please enter a valid email address'
            };
        }

        // Convert to lowercase for comparison
        const lowerEmail = email.toLowerCase();
        const domain = lowerEmail.split('@')[1];
        const username = lowerEmail.split('@')[0];

        // Check for temporary email domains
        if (tempEmailDomains.includes(domain)) {
            return {
                isValid: false,
                message: 'Temporary email addresses are not allowed. Please use a permanent email address.'
            };
        }

        // Check for fake email patterns
        for (const pattern of fakeEmailPatterns) {
            if (pattern.test(lowerEmail)) {
                return {
                    isValid: false,
                    message: 'Please provide a valid personal email address'
                };
            }
        }

        // Check for suspicious patterns
        if (username.length < 2) {
            return {
                isValid: false,
                message: 'Email username is too short. Please use a valid email address.'
            };
        }

        // Check for common fake domains
        const suspiciousDomains = ['example.com', 'test.com', 'fake.com', 'dummy.com'];
        if (suspiciousDomains.includes(domain)) {
            return {
                isValid: false,
                message: 'Please use a real email address'
            };
        }

        // Check if domain has valid MX records (DNS lookup)
        try {
            // Wrap DNS lookup in a promise
            const checkMxRecords = () => {
                return new Promise((resolve, reject) => {
                    dns.resolveMx(domain, (err, addresses) => {
                        if (err) {
                            // DNS error or no MX records
                            reject(err);
                        } else if (addresses && addresses.length > 0) {
                            // Valid MX records found
                            resolve(true);
                        } else {
                            // No MX records
                            resolve(false);
                        }
                    });
                });
            };
            
            const hasMxRecords = await checkMxRecords();
            if (!hasMxRecords) {
                return {
                    isValid: false,
                    message: 'Email domain does not have valid mail servers. Please use a valid email address.'
                };
            }
        } catch (dnsError) {
            console.log('MX record check failed:', dnsError.message);
            // We'll continue even if MX check fails to avoid blocking valid users
            // in case of temporary DNS issues
        }

        return {
            isValid: true,
            message: 'Email is valid'
        };

    } catch (error) {
        console.error('Email validation error:', error);
        return {
            isValid: false,
            message: 'Email validation failed. Please try again.'
        };
    }
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
    if (!password || password.length < 8) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long'
        };
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one lowercase letter'
        };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one uppercase letter'
        };
    }

    if (!/(?=.*\d)/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one number'
        };
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one special character (@$!%*?&)'
        };
    }

    return {
        isValid: true,
        message: 'Password is strong'
    };
};

/**
 * Validates name format
 * @param {string} name - Name to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateName = (name) => {
    if (!name || name.trim().length < 2) {
        return {
            isValid: false,
            message: 'Name must be at least 2 characters long'
        };
    }

    if (name.trim().length > 50) {
        return {
            isValid: false,
            message: 'Name must be less than 50 characters'
        };
    }

    // Check for valid name characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
        return {
            isValid: false,
            message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
        };
    }

    return {
        isValid: true,
        message: 'Name is valid'
    };
};