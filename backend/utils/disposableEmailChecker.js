import https from 'https';
import http from 'http';

// Comprehensive list of disposable email domains
const disposableDomains = new Set([
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
    
    // Additional comprehensive list
    'emailfake.com', 'mohmal.com', 'burnermail.io', 'mailtemp.info',
    'tempmail.fun', 'tempmail.ltd', 'tempmail.tech', 'tempmail.world',
    'tempmail.zone', 'tempmail.host', 'tempmail.store', 'tempmail.online',
    'tempmail.website', 'emailtemp.org', 'tempemails.net', 'tempmails.net',
    'tempemails.com', 'tempmails.com', 'tempemails.org', 'tempmails.org',
    'tempemails.info', 'tempmails.info', 'tempemails.co', 'tempmails.co',
    'tempemails.biz', 'tempmails.biz', 'tempemails.us', 'tempmails.us',
    
    // Extended list for maximum coverage
    'correotemporal.org', 'correo.blogos.net', 'desechable.com', 'despam.it',
    'devnullmail.com', 'discardmail.com', 'discardmail.de', 'disposableaddress.com',
    'disposable.com', 'disposableinbox.com', 'dispose.it', 'dodgeit.com',
    'dodgit.com', 'donemail.ru', 'dontreg.com', 'dontsendmespam.de',
    'dump-email.info', 'dumpandjunk.com', 'dumpyemail.com', 'e4ward.com',
    'email60.com', 'emailias.com', 'emailinfive.com', 'emailmiser.com',
    'emailsensei.com', 'emailtemporanea.com', 'emailtemporanea.net',
    'emailtemporaria.com.br', 'emailthe.net', 'emailtmp.com', 'emailto.de',
    'emailwarden.com', 'enterto.com', 'ephemail.net', 'explodemail.com',
    'fakemailgenerator.com', 'filzmail.com', 'fizmail.com', 'fleckens.hu',
    'frapmail.com', 'front14.org', 'fux0ringduh.com', 'garliclife.com',
    'get1mail.com', 'get2mail.fr', 'getairmail.com', 'getmails.eu',
    'getonemail.com', 'getonemail.net', 'ghosttexter.de', 'great-host.in',
    'greensloth.com', 'grr.la', 'gsrv.co.uk', 'haltospam.com',
    'hatespam.org', 'hidemail.de', 'hidzz.com', 'hmamail.com',
    'hochsitze.com', 'hotpop.com', 'hulapla.de', 'ieatspam.eu',
    'ieatspam.info', 'ieh-mail.de', 'imails.info', 'inboxalias.com',
    'inboxclean.com', 'inboxclean.org', 'infocom.zp.ua', 'instant-mail.de',
    'ip6.li', 'irish2me.com', 'iwi.net', 'jnxjn.com', 'jourrapide.com',
    'jsrsolutions.com', 'junk1e.com', 'kaspop.com', 'keepmymail.com',
    'killmail.com', 'killmail.net', 'klassmaster.com', 'klzlk.com',
    'kook.ml', 'koszmail.pl', 'kurzepost.de', 'lawlita.com',
    'letthemeatspam.com', 'lhsdv.com', 'lifebyfood.com', 'link2mail.net',
    'litedrop.com', 'lol.ovpn.to', 'lookugly.com', 'lopl.co.cc',
    'lortemail.dk', 'lr78.com', 'lroid.com', 'lukop.dk',
    'm4ilweb.info', 'maboard.com', 'mail-filter.com', 'mail-temporaire.fr',
    'mail.by', 'mail.mezimages.net', 'mail.zp.ua', 'mail1a.de',
    'mail21.cc', 'mail2rss.org', 'mail333.com', 'mail4trash.com',
    'mailbidon.com', 'mailbiz.biz', 'mailblocks.com', 'mailbucket.org',
    'mailcat.biz', 'mailde.de', 'mailde.info', 'maildx.com',
    'maileater.com', 'mailed.ro', 'maileimer.de', 'mailexpire.com',
    'mailfa.tk', 'mailforspam.com', 'mailfreeonline.com', 'mailguard.me',
    'mailin8r.com', 'mailinater.com', 'mailinator.gq', 'mailinator2.com',
    'mailincubator.com', 'mailismagic.com', 'mailme.lv', 'mailme24.com',
    'mailmetrash.com', 'mailmoat.com', 'mailnator.com', 'mailnull.com',
    'mailorg.org', 'mailpick.biz', 'mailrock.biz', 'mailscrap.com',
    'mailshell.com', 'mailsiphon.com', 'mailtome.de', 'mailtothis.com',
    'mailtrash.net', 'mailtv.net', 'mailtv.tv', 'mailzilla.com',
    'mailzilla.org', 'makemetheking.com', 'manybrain.com', 'mbx.cc',
    'mega.zik.dj', 'meinspamschutz.de', 'meltmail.com', 'messagebeamer.de',
    'mierdamail.com', 'mintemail.com', 'mjukglass.nu', 'mobi.web.id',
    'moburl.com', 'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf',
    'monumentmail.com', 'mt2009.com', 'mt2014.com', 'mycard.net.ua',
    'mycleaninbox.net', 'myemailboxy.com', 'mymail-in.net', 'mymailoasis.com',
    'mynetstore.de', 'mypacks.net', 'mypartyclip.de', 'myphantomemail.com',
    'mysamp.de', 'mytempemail.com', 'mytempmail.com', 'neomailbox.com',
    'nepwk.com', 'nervmich.net', 'nervtmich.net', 'netmails.com',
    'netmails.net', 'netzidiot.de', 'neverbox.com', 'nice-4u.com',
    'nincsmail.com', 'nincsmail.hu', 'nnh.com', 'noblepioneer.com',
    'nomail2me.com', 'nomorespamemails.com', 'nonspam.eu', 'nonspammer.de',
    'noref.in', 'nospam.ze.tc', 'nospam4.us', 'nospamfor.us',
    'nospammail.net', 'nospamthanks.info', 'notsharingmy.info', 'nowhere.org',
    'nurfuerspam.de', 'nus.edu.sg', 'nwldx.com', 'odnorazovoe.ru',
    'one-time.email', 'online.ms', 'opayq.com', 'ordinaryamerican.net',
    'otherinbox.com', 'ovpn.to', 'owlpic.com', 'pancakemail.com',
    'pcusers.otherinbox.com', 'pjkh.com', 'plexolan.de', 'poczta.onet.pl',
    'politikerclub.de', 'pooae.com', 'privacy.net', 'privatdemail.net',
    'proxymail.eu', 'prtnx.com', 'putthisinyourspamdatabase.com', 'pwrby.com',
    'reallymymail.com', 'realtyalerts.ca', 'recyclebin.jp', 'rejectmail.com',
    'reliable-mail.com', 'rhyta.com', 'royal.net', 'rppkn.com',
    'rtrtr.com', 's0ny.net', 'safersignup.de', 'safetymail.info',
    'safetypost.de', 'sandelf.de', 'saynotospams.com', 'schafmail.de',
    'schrott-email.de', 'secretemail.de', 'secure-mail.biz', 'selfdestructingmail.org',
    'shitmail.me', 'shitware.nl', 'shmeriously.com', 'shortmail.net',
    'sibmail.com', 'sinnlos-mail.de', 'siteposter.net', 'skeefmail.com',
    'slaskpost.se', 'slopsbox.com', 'slushmail.com', 'smashmail.de',
    'smellfear.com', 'snakemail.com', 'sneakemail.com', 'snkmail.com',
    'sofimail.com', 'sofort-mail.de', 'sogetthis.com', 'spam.la',
    'spam.su', 'spamail.de', 'spambob.com', 'spambob.net',
    'spambob.org', 'spambox.info', 'spambox.irishspringtours.com', 'spambox.us',
    'spamcannon.com', 'spamcannon.net', 'spamcon.org', 'spamcorptastic.com',
    'spamcowboy.com', 'spamcowboy.net', 'spamcowboy.org', 'spamday.com',
    'spamfree24.com', 'spamfree24.de', 'spamfree24.eu', 'spamfree24.info',
    'spamfree24.net', 'spamgoes.com', 'spamherelots.com', 'spamhereplease.com',
    'spami.spam.co.za', 'spaminator.de', 'spamkill.info', 'spaml.de',
    'spamobox.com', 'spamoff.de', 'spamslicer.com', 'spamstack.net',
    'spamtrail.com', 'spamtroll.net', 'spoofmail.de', 'stuffmail.de',
    'super-auswahl.de', 'supergreatmail.com', 'supermailer.jp', 'superstachel.de',
    'suremail.info', 'talkinator.com', 'tapchicuoihoi.com', 'teewars.org',
    'teleworm.com', 'teleworm.us', 'temp-mail.de', 'temp-mail.ru',
    'temp.emeraldwebmail.com', 'tempalias.com', 'tempe-mail.com', 'tempemail.biz',
    'tempinbox.co.uk', 'tempmail.eu', 'tempmaildemo.com', 'tempmailer.com',
    'tempmailer.de', 'tempmailid.com', 'tempoid.com', 'tempsky.com',
    'thanksnospam.info', 'thc.st', 'thelimestones.com', 'thisisnotmyrealemail.com',
    'thismail.net', 'throwam.com', 'throwawayemailaddresses.com', 'tilien.com',
    'tittbit.in', 'tmail.ws', 'tmailinator.com', 'toiea.com',
    'toomail.biz', 'topranklist.de', 'tradermail.info', 'trash-amil.com',
    'trash-mail.at', 'trash-mail.com', 'trash-mail.de', 'trashdevil.de',
    'trashemail.de', 'trashmail.at', 'trashmail.de', 'trashmail.me',
    'trashmail.net', 'trashmail.org', 'trashmail.ws', 'trashmailer.com',
    'trashymail.net', 'trialmail.de', 'trillianpro.com', 'tryalert.com',
    'turual.com', 'twinmail.de', 'umail.net', 'upliftnow.com',
    'uplipht.com', 'uroid.com', 'us.af', 'venompen.com',
    'veryrealemail.com', 'vidchart.com', 'viditag.com', 'viewcastmedia.com',
    'viewcastmedia.net', 'viewcastmedia.org', 'vomoto.com', 'vubby.com',
    'walala.org', 'walkmail.net', 'webemail.me', 'webm4il.info',
    'wegwerfadresse.de', 'wegwerfemail.de', 'whatiaas.com', 'whatpaas.com',
    'whatsaas.com', 'whopy.com', 'willhackforfood.biz', 'winemaven.info',
    'wronghead.com', 'wuzup.net', 'wuzupmail.net', 'www.e4ward.com',
    'www.gishpuppy.com', 'www.mailinator.com', 'wwwnew.eu', 'x.ip6.li',
    'xagloo.com', 'xemaps.com', 'xents.com', 'xmaily.com',
    'yapped.net', 'yeah.net', 'yep.it', 'ypmail.webredirect.org',
    'yuurok.com', 'zehnminutenmail.de', 'zetmail.com', 'zippymail.info',
    'zoaxe.com', 'zomg.info', 'zxcv.com', 'zxcvbnm.com', 'zzz.com'
]);

// Patterns that indicate disposable emails
const disposablePatterns = [
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
    /minute.*mail/i,
    /burner/i,
    /temporary/i
];

// Allowed email domains - only major providers
const allowedDomains = new Set([
    // Gmail domains
    'gmail.com',
    'googlemail.com',
    
    // Outlook/Microsoft domains
    'outlook.com',
    'hotmail.com',
    'live.com',
    'msn.com',
    
    // Yahoo domains
    'yahoo.com',
    'yahoo.co.uk',
    'yahoo.ca',
    'yahoo.com.au',
    'yahoo.in',
    'ymail.com',
    'rocketmail.com'
]);

/**
 * Check if an email domain is allowed (only Gmail, Outlook, Yahoo)
 * @param {string} email - Email address to check
 * @returns {boolean} - True if allowed, false if not allowed
 */
export const isAllowedEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const domain = email.toLowerCase().split('@')[1];
    if (!domain) {
        return false;
    }

    // Check if domain is in allowed list
    if (allowedDomains.has(domain)) {
        console.log(`Allowed email domain: ${domain}`);
        return true;
    }

    console.log(`Blocked email domain: ${domain} - Only Gmail, Outlook, and Yahoo are allowed`);
    return false;
};

/**
 * Check if an email domain is disposable (legacy function - now checks against allowed list)
 * @param {string} email - Email address to check
 * @returns {boolean} - True if not allowed, false if allowed
 */
export const isDisposableEmail = (email) => {
    return !isAllowedEmail(email);
};

/**
 * API-based disposable email check (optional fallback)
 * @param {string} domain - Domain to check
 * @returns {Promise<boolean|null>} - True if disposable, false if legitimate, null if API error
 */
export const checkDisposableEmailAPI = async (domain) => {
    return new Promise((resolve) => {
        // Using a simple HTTP request to avoid fetch dependency issues
        const url = `https://api.mailcheck.co/domain/${domain}`;
        
        const request = https.get(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'VeggeTech-EmailValidator/1.0'
            },
            timeout: 3000
        }, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.disposable === true) {
                        console.log(`API confirmed disposable: ${domain}`);
                        resolve(true);
                    } else if (result.disposable === false) {
                        console.log(`API confirmed legitimate: ${domain}`);
                        resolve(false);
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    console.log(`API parse error for ${domain}:`, error.message);
                    resolve(null);
                }
            });
        });

        request.on('error', (error) => {
            console.log(`API request error for ${domain}:`, error.message);
            resolve(null);
        });

        request.on('timeout', () => {
            console.log(`API timeout for ${domain}`);
            request.destroy();
            resolve(null);
        });
    });
};

/**
 * Comprehensive disposable email check
 * @param {string} email - Email address to check
 * @returns {Promise<boolean>} - True if disposable, false if legitimate
 */
export const isDisposableEmailComprehensive = async (email) => {
    // First check local database
    if (isDisposableEmail(email)) {
        return true;
    }

    // Optional: Check with API for additional verification
    try {
        const domain = email.toLowerCase().split('@')[1];
        const apiResult = await checkDisposableEmailAPI(domain);
        
        if (apiResult === true) {
            return true;
        }
    } catch (error) {
        console.log('API check failed, using local check only');
    }

    return false;
};