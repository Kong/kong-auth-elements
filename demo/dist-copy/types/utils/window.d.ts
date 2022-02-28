declare const win: {
    getLocationSearch: () => string;
    getLocationHostname: () => string;
    getLocationHref: () => string;
    getLocationPathname: () => string;
    getLocationOrigin: () => string;
    setLocationHref: (url: string) => void;
};
export default win;
