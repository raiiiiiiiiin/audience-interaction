let backendHost;

const hostname = window && window.location && window.location.hostname;
console.log('hostname: ' + hostname);
if(hostname === 'localhost') {
    backendHost = 'http://localhost:3090';
} else if (hostname === '192.168.0.138') {
    backendHost = 'http://192.168.0.138:3090';
} else {
    backendHost = 'https://api-gateway-optimistic-chimpanzee.cfapps.io';
}

export const API_ROOT = backendHost;