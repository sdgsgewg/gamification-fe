export function isProduction() {
    return false;
}

function getServerUri(): string {
    if (isProduction()) {
        // Production
        return 'https://your-app.com/';
    } else {
        // Development
        // return 'https://dev.accelist.com:9559/';
        return 'http://localhost:3001/';
    }
}
export const serverUri = getServerUri();