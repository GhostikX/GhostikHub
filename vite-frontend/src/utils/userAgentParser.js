export default function parseUserAgent(userAgent) {
    const result = {
        browser: '',
        version: '',
        platform: '',
    };

    // Check platform (Operating System)
    if (/Windows NT/.test(userAgent)) {
        result.platform = 'Windows';
    } else if (/Macintosh/.test(userAgent)) {
        result.platform = 'Mac OS';
    } else if (/Linux/.test(userAgent)) {
        result.platform = 'Linux';
    } else if (/Android/.test(userAgent)) {
        result.platform = 'Android';
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
        result.platform = 'iOS';
    }

    // Check browser
    if (/Opera|OPR/.test(userAgent)) {
        result.browser = 'Opera';
        result.version = userAgent.match(/(?:Opera|OPR)[\/\s](\d+(\.\d+)+)/)[1];
    } else if (/Edg/.test(userAgent)) {
        result.browser = 'Edge';
        result.version = userAgent.match(/Edg[\/\s](\d+(\.\d+)+)/)[1];
    } else if (/Chrome/.test(userAgent) && !/Edge/.test(userAgent) && !/OPR/.test(userAgent)) {
        result.browser = 'Chrome';
        result.version = userAgent.match(/Chrome[\/\s](\d+(\.\d+)+)/)[1];
    } else if (/Firefox/.test(userAgent)) {
        result.browser = 'Firefox';
        result.version = userAgent.match(/Firefox[\/\s](\d+(\.\d+)+)/)[1];
    } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
        result.browser = 'Safari';
        result.version = userAgent.match(/Safari[\/\s](\d+(\.\d+)+)/)[1];
    } else {
        result.browser = 'Unknown';
        result.version = 'Unknown';
    }

    return result;
}
