import validator from 'validator';
import dns from 'dns';
import https from 'https';
import http from 'http';

// Comprehensive list of temporary/disposable email domains
const tempEmailDomains = [
    // temp-mail.org and related domains
    'forexru.com', 'temp-mail.org', 'tempmail.org', 'tempmailaddress.com',
    'tempmailo.com', 'tempmail.net', 'tempmail.co', 'tempmail.io',
    'tempmail.de', 'tempmail.plus', 'tempmail.email', 'tempmail.ninja',
    'tempmail.us.com', 'tempmail.click', 'tempmail.today', 'tempmail.live',
    'tempmail.space', 'tempmail.site', 'tempmail.gq', 'tempmail.ml',
    'tempmail.ga', 'tempmail.tk', 'tempmail.cf', 'tempmail.icu',
    
    // Major temporary email providers
    '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minut.com.pl',
    'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz',
    'guerrillamail.de', 'guerrillamail.info', 'guerrillamailblock.com',
    'mailinator.com', 'mailinator.net', 'mailinator.org',
    'yopmail.com', 'yopmail.fr', 'yopmail.net',
    'throwaway.email', 'throwawaymail.com', 'trashmail.com',
    'maildrop.cc', 'maildrop.com', 'maildrop.net',
    'sharklasers.com', 'pokemail.net', 'spam4.me',
    'tempail.com', 'tempemail.com', 'tempinbox.com', 'tempymail.com',
    'dispostable.com', 'emailondeck.com', 'fakeinbox.com',
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
    'speed.1s.fr', 'superrito.com', 'tempemail.net',
    'thankyou2010.com', 'trash2009.com', 'trashdevil.com', 'trashymail.com',
    'tyldd.com', 'uggsrock.com', 'wegwerfmail.de', 'wegwerfmail.net',
    'wegwerfmail.org', 'wh4f.org', 'whyspam.me', 'willselfdestruct.com',
    'xoxy.net', 'yogamaven.com', 'zoemail.org', '0-mail.com', '0815.ru',
    '0clickemail.com', '0wnd.net', '0wnd.org', '10mail.org',
    '10x9.com', '123-m.com', '1chuan.com', '1pad.de', '20mail.it',
    '20minutemail.com', '2prong.com', '30minutemail.com', '33mail.com',
    '3d-painting.com', '4warding.com', '4warding.net', '4warding.org',
    '60minutemail.com', '675hosting.com', '675hosting.net', '675hosting.org',
    '6url.com', '75hosting.com', '75hosting.net', '75hosting.org',
    '7tags.com', '9ox.net', 'a-bc.net', 'afrobacon.com', 'ajaxapp.net',
    
    // Additional disposable domains
    'emailfake.com', 'mohmal.com', 'burnermail.io', 'mailtemp.info',
    'tempmail.fun', 'tempmail.ltd', 'tempmail.tech', 'tempmail.world',
    'tempmail.zone', 'tempmail.host', 'tempmail.store', 'tempmail.online',
    'tempmail.website', 'emailtemp.org', 'tempemails.net', 'tempmails.net',
    'tempemails.com', 'tempmails.com', 'tempemails.org', 'tempmails.org',
    'tempemails.info', 'tempmails.info', 'tempemails.co', 'tempmails.co',
    'tempemails.biz', 'tempmails.biz', 'tempemails.us', 'tempmails.us',
    
    // More comprehensive list
    'correotemporal.org', 'correo.blogos.net', 'desechable.com', 'despam.it',
    'devnullmail.com', 'discardmail.com', 'discardmail.de', 'disposableaddress.com',
    'disposable.com', 'disposableinbox.com', 'dispose.it', 'dodgeit.com',
    'dodgit.com', 'donemail.ru', 'dontreg.com', 'dontsendmespam.de',
    'dump-email.info', 'dumpandjunk.com', 'dumpyemail.com', 'e4ward.com',
    'email60.com', 'emailias.com', 'emailinfive.com', 'emailmiser.com',
    'emailsensei.com', 'emailtemporanea.com', 'emailtemporanea.net',
    'emailtemporaria.com.br', 'emailthe.net', 'emailtmp.com', 'emailto.de',
    'emailwarden.com', 'enterto.com', 'ephemail.net', 'explodemail.com',
    'fakemailgenerator.com', 'fastacura.com', 'fastchevy.com', 'fastchrysler.com',
    'fastkawasaki.com', 'fastmazda.com', 'fastmitsubishi.com', 'fastnissan.com',
    'fastsubaru.com', 'fastsuzuki.com', 'fasttoyota.com', 'fastyamaha.com',
    'filzmail.com', 'fizmail.com', 'fleckens.hu', 'frapmail.com', 'front14.org',
    'fux0ringduh.com', 'garliclife.com', 'get1mail.com', 'get2mail.fr',
    'getairmail.com', 'getmails.eu', 'getonemail.com', 'getonemail.net',
    'ghosttexter.de', 'girlsundertheinfluence.com', 'gishpuppy.com', 'great-host.in',
    'greensloth.com', 'grr.la', 'gsrv.co.uk', 'guerillamail.biz', 'guerillamail.com',
    'guerillamail.de', 'guerillamail.net', 'guerillamail.org', 'guerrillamailblock.com',
    'h.mintemail.com', 'haltospam.com', 'hatespam.org', 'hidemail.de',
    'hidzz.com', 'hmamail.com', 'hochsitze.com', 'hotpop.com', 'hulapla.de',
    'ieatspam.eu', 'ieatspam.info', 'ieh-mail.de', 'imails.info', 'inboxalias.com',
    'inboxclean.com', 'inboxclean.org', 'infocom.zp.ua', 'instant-mail.de',
    'ip6.li', 'irish2me.com', 'iwi.net', 'jnxjn.com', 'jourrapide.com',
    'jsrsolutions.com', 'junk1e.com', 'kaspop.com', 'keepmymail.com',
    'killmail.com', 'killmail.net', 'klassmaster.com', 'klzlk.com', 'kook.ml',
    'koszmail.pl', 'kurzepost.de', 'lawlita.com', 'letthemeatspam.com',
    'lhsdv.com', 'lifebyfood.com', 'link2mail.net', 'litedrop.com',
    'lol.ovpn.to', 'lookugly.com', 'lopl.co.cc', 'lortemail.dk', 'lr78.com',
    'lroid.com', 'lukop.dk', 'm4ilweb.info', 'maboard.com', 'mail-filter.com',
    'mail-temporaire.fr', 'mail.by', 'mail.mezimages.net', 'mail.zp.ua',
    'mail1a.de', 'mail21.cc', 'mail2rss.org', 'mail333.com', 'mail4trash.com',
    'mailbidon.com', 'mailbiz.biz', 'mailblocks.com', 'mailbucket.org',
    'mailcat.biz', 'mailcatch.com', 'mailde.de', 'mailde.info', 'maildx.com',
    'maileater.com', 'mailed.ro', 'maileimer.de', 'mailexpire.com',
    'mailfa.tk', 'mailforspam.com', 'mailfreeonline.com', 'mailguard.me',
    'mailin8r.com', 'mailinater.com', 'mailinator.gq', 'mailinator2.com',
    'mailincubator.com', 'mailismagic.com', 'mailme.lv', 'mailme24.com',
    'mailmetrash.com', 'mailmoat.com', 'mailnator.com', 'mailnull.com',
    'mailorg.org', 'mailpick.biz', 'mailrock.biz', 'mailscrap.com',
    'mailshell.com', 'mailsiphon.com', 'mailtemp.info', 'mailtome.de',
    'mailtothis.com', 'mailtrash.net', 'mailtv.net', 'mailtv.tv',
    'mailzilla.com', 'mailzilla.org', 'makemetheking.com', 'manybrain.com',
    'mbx.cc', 'mega.zik.dj', 'meinspamschutz.de', 'meltmail.com',
    'messagebeamer.de', 'mierdamail.com', 'mintemail.com', 'mjukglass.nu',
    'mobi.web.id', 'moburl.com', 'moncourrier.fr.nf', 'monemail.fr.nf',
    'monmail.fr.nf', 'monumentmail.com', 'mt2009.com', 'mt2014.com',
    'mycard.net.ua', 'mycleaninbox.net', 'myemailboxy.com', 'mymail-in.net',
    'mymailoasis.com', 'mynetstore.de', 'mypacks.net', 'mypartyclip.de',
    'myphantomemail.com', 'mysamp.de', 'mytempemail.com', 'mytempmail.com',
    'mytrashmail.com', 'neomailbox.com', 'nepwk.com', 'nervmich.net',
    'nervtmich.net', 'netmails.com', 'netmails.net', 'netzidiot.de',
    'neverbox.com', 'nice-4u.com', 'nincsmail.com', 'nincsmail.hu',
    'nnh.com', 'no-spam.ws', 'noblepioneer.com', 'nomail.xl.cx',
    'nomail2me.com', 'nomorespamemails.com', 'nonspam.eu', 'nonspammer.de',
    'noref.in', 'nospam.ze.tc', 'nospam4.us', 'nospamfor.us',
    'nospammail.net', 'nospamthanks.info', 'notmailinator.com', 'notsharingmy.info',
    'nowhere.org', 'nowmymail.com', 'nurfuerspam.de', 'nus.edu.sg',
    'nwldx.com', 'objectmail.com', 'obobbo.com', 'odnorazovoe.ru',
    'one-time.email', 'onewaymail.com', 'online.ms', 'opayq.com',
    'ordinaryamerican.net', 'otherinbox.com', 'ovpn.to', 'owlpic.com',
    'pancakemail.com', 'pcusers.otherinbox.com', 'pjkh.com', 'plexolan.de',
    'poczta.onet.pl', 'politikerclub.de', 'pooae.com', 'pookmail.com',
    'privacy.net', 'privatdemail.net', 'proxymail.eu', 'prtnx.com',
    'putthisinyourspamdatabase.com', 'pwrby.com', 'quickinbox.com', 'rcpt.at',
    'reallymymail.com', 'realtyalerts.ca', 'recode.me', 'recursor.net',
    'recyclebin.jp', 'regbypass.com', 'regbypass.comsafe-mail.net', 'rejectmail.com',
    'reliable-mail.com', 'rhyta.com', 'rmqkr.net', 'royal.net', 'rppkn.com',
    'rtrtr.com', 's0ny.net', 'safe-mail.net', 'safersignup.de', 'safetymail.info',
    'safetypost.de', 'sandelf.de', 'saynotospams.com', 'schafmail.de',
    'schrott-email.de', 'secretemail.de', 'secure-mail.biz', 'selfdestructingmail.com',
    'selfdestructingmail.org', 'sendspamhere.com', 'sharklasers.com', 'shieldedmail.com',
    'shitmail.me', 'shitware.nl', 'shmeriously.com', 'shortmail.net',
    'sibmail.com', 'sinnlos-mail.de', 'siteposter.net', 'skeefmail.com',
    'slaskpost.se', 'slopsbox.com', 'slushmail.com', 'smashmail.de',
    'smellfear.com', 'snakemail.com', 'sneakemail.com', 'snkmail.com',
    'sofimail.com', 'sofort-mail.de', 'sogetthis.com', 'soodonims.com',
    'spam.la', 'spam.su', 'spam4.me', 'spamail.de', 'spambob.com',
    'spambob.net', 'spambob.org', 'spambog.com', 'spambog.de',
    'spambog.ru', 'spambox.info', 'spambox.irishspringtours.com', 'spambox.us',
    'spamcannon.com', 'spamcannon.net', 'spamcon.org', 'spamcorptastic.com',
    'spamcowboy.com', 'spamcowboy.net', 'spamcowboy.org', 'spamday.com',
    'spamex.com', 'spamfree24.com', 'spamfree24.de', 'spamfree24.eu',
    'spamfree24.info', 'spamfree24.net', 'spamfree24.org', 'spamgoes.com',
    'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org', 'spamherelots.com',
    'spamhereplease.com', 'spamhole.com', 'spami.spam.co.za', 'spamify.com',
    'spaminator.de', 'spamkill.info', 'spaml.com', 'spaml.de',
    'spammotel.com', 'spamobox.com', 'spamoff.de', 'spamslicer.com',
    'spamspot.com', 'spamstack.net', 'spamthis.co.uk', 'spamthisplease.com',
    'spamtrail.com', 'spamtroll.net', 'speed.1s.fr', 'spoofmail.de',
    'stuffmail.de', 'super-auswahl.de', 'supergreatmail.com', 'supermailer.jp',
    'superrito.com', 'superstachel.de', 'suremail.info', 'talkinator.com',
    'tapchicuoihoi.com', 'teewars.org', 'teleworm.com', 'teleworm.us',
    'temp-mail.de', 'temp-mail.org', 'temp-mail.ru', 'temp.emeraldwebmail.com',
    'tempail.com', 'tempalias.com', 'tempe-mail.com', 'tempemail.biz',
    'tempemail.com', 'tempinbox.co.uk', 'tempinbox.com', 'tempmail.eu',
    'tempmaildemo.com', 'tempmailer.com', 'tempmailer.de', 'tempmailid.com',
    'tempoid.com', 'tempsky.com', 'tempymail.com', 'thanksnospam.info',
    'thankyou2010.com', 'thc.st', 'thelimestones.com', 'thisisnotmyrealemail.com',
    'thismail.net', 'throwam.com', 'throwawayemailaddresses.com', 'tilien.com',
    'tittbit.in', 'tmail.ws', 'tmailinator.com', 'toiea.com',
    'toomail.biz', 'topranklist.de', 'tradermail.info', 'trash-amil.com',
    'trash-mail.at', 'trash-mail.com', 'trash-mail.de', 'trash2009.com',
    'trashdevil.com', 'trashdevil.de', 'trashemail.de', 'trashmail.at',
    'trashmail.com', 'trashmail.de', 'trashmail.me', 'trashmail.net',
    'trashmail.org', 'trashmail.ws', 'trashmailer.com', 'trashymail.com',
    'trashymail.net', 'trialmail.de', 'trillianpro.com', 'tryalert.com',
    'turual.com', 'twinmail.de', 'tyldd.com', 'uggsrock.com',
    'umail.net', 'upliftnow.com', 'uplipht.com', 'uroid.com',
    'us.af', 'venompen.com', 'veryrealemail.com', 'vidchart.com',
    'viditag.com', 'viewcastmedia.com', 'viewcastmedia.net', 'viewcastmedia.org',
    'vomoto.com', 'vubby.com', 'walala.org', 'walkmail.net',
    'webemail.me', 'webm4il.info', 'wegwerfadresse.de', 'wegwerfemail.de',
    'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org', 'wh4f.org',
    'whatiaas.com', 'whatpaas.com', 'whatsaas.com', 'whopy.com',
    'whyspam.me', 'willhackforfood.biz', 'willselfdestruct.com', 'winemaven.info',
    'wronghead.com', 'wuzup.net', 'wuzupmail.net', 'www.e4ward.com',
    'www.gishpuppy.com', 'www.mailinator.com', 'wwwnew.eu', 'x.ip6.li',
    'xagloo.com', 'xemaps.com', 'xents.com', 'xmaily.com',
    'xoxy.net', 'yapped.net', 'yeah.net', 'yep.it',
    'yogamaven.com', 'yopmail.com', 'yopmail.fr', 'yopmail.net',
    'yourdomain.com', 'ypmail.webredirect.org', 'yuurok.com', 'zehnminutenmail.de',
    'zetmail.com', 'zippymail.info', 'zoaxe.com', 'zoemail.org',
    'zomg.info', 'zxcv.com', 'zxcvbnm.com', 'zzz.com'
];

// Removed API function - using comprehensive domain list approach instead

// List of fake/suspicious email patterns - only obvious test patterns
const fakeEmailPatterns = [
    /^test@/i,
    /^fake@/i,
    /^dummy@/i,
    /^sample@/i,
    /^example@/i
    // Removed noreply and donotreply as they might be legitimate in some cases
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

        // Check comprehensive list of temporary/disposable email domains
        if (tempEmailDomains.includes(domain)) {
            return {
                isValid: false,
                message: 'Temporary email addresses are not allowed. Please use a permanent email address.'
            };
        }

        // Additional pattern-based checks for temp emails
        const tempEmailPatterns = [
            /temp.*mail/i,
            /mail.*temp/i,
            /disposable/i,
            /throwaway/i,
            /trash.*mail/i,
            /mail.*trash/i,
            /spam.*mail/i,
            /mail.*spam/i,
            /fake.*mail/i,
            /mail.*fake/i,
            /guerrilla/i,
            /mailinator/i,
            /10.*minute/i,
            /minute.*mail/i
        ];

        for (const pattern of tempEmailPatterns) {
            if (pattern.test(domain)) {
                return {
                    isValid: false,
                    message: 'Temporary email addresses are not allowed. Please use a permanent email address.'
                };
            }
        }

        // Check for fake email patterns - only check obvious test emails
        for (const pattern of fakeEmailPatterns) {
            if (pattern.test(lowerEmail)) {
                return {
                    isValid: false,
                    message: 'Please provide a valid personal email address'
                };
            }
        }

        // Only check for very short usernames (single character)
        if (username.length < 1) {
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

        // MX record check is now optional and won't block registration
        // This is to avoid issues with valid domains that might have DNS resolution problems
        try {
            // Only perform MX check for domains that aren't common email providers
            const commonEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com', 'mail.com'];

            if (!commonEmailProviders.includes(domain)) {
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

                try {
                    const hasMxRecords = await checkMxRecords();
                    // Log the result but don't block registration
                    if (!hasMxRecords) {
                        console.log(`Warning: Domain ${domain} has no MX records, but allowing registration anyway`);
                    }
                } catch (innerDnsError) {
                    console.log(`MX record check error for ${domain}:`, innerDnsError.message);
                }
            }
        } catch (dnsError) {
            console.log('MX record check failed:', dnsError.message);
            // Continue regardless of DNS issues
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