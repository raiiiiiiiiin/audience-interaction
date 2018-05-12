let backendHost;

const hostname = window && window.location && window.location.hostname;

if(hostname === 'localhost') {
    backendHost = 'http://localhost:3090';
} else {
    backendHost = 'https://rss-be-fantastic-kookaburra.cfapps.io'; // TODO
}

export const API_ROOT = backendHost;