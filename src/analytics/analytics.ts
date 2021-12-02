type Company = {
  id: string;
  name: string;
};
type UserData = {
  email: string;
  id: string;
  company?: Company;
  name?: string;
};
type IdentifyAnalyticsEvent = ({
  userId,
  userData,
}: {
  userId: string;
  userData: UserData;
}) => void;
const identify: IdentifyAnalyticsEvent = ({ userId, userData }) => {
  window.analytics.identify(
    userId,
    {
      ...userData,
    },
    {},
  );
};

type PageAnalyticsEvent = (event: string) => void;
const page: PageAnalyticsEvent = (event) => {
  window.analytics.page(event);
};

type ResetAnalyticsEvent = () => void;
const reset: ResetAnalyticsEvent = () => {
  window.analytics.track('Signed Out', {}, {}, () => {
    window.analytics.reset();
    // window.Intercom?.('shutdown');
  });
};

type TrackAnalyticsEvent = (
  event: string,
  properties?: Record<string, unknown>,
  options?: Record<string, unknown>,
  callback?: any,
) => void;
const track: TrackAnalyticsEvent = (event, properties, options, callback) => {
  window.analytics.track(event, properties, options, callback);
};

export interface Analytics {
  identify: IdentifyAnalyticsEvent;
  page: PageAnalyticsEvent;
  reset: ResetAnalyticsEvent;
  track: TrackAnalyticsEvent;
}

/** this function is adapted from https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/ */
const loadSegment = (segmentWriteKey: string) => {
  // Create a queue, but don't obliterate an existing one!
  const analytics: any = (window.analytics = window.analytics || []);

  // If the real analytics.js is already on the page return.
  if (analytics.initialize) {
    return;
  }

  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    /* eslint-disable no-console */
    if (window.console && console.error) {
      console.error('Segment snippet included twice.');
      /* eslint-enable no-console */
    }

    return;
  }

  // Invoked flag, to make sure the snippet is never invoked twice.
  analytics.invoked = true;

  // A list of the methods in Analytics.js to stub.
  analytics.methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'pageview',
    'identify',
    'reset',
    'group',
    'track',
    'ready',
    'alias',
    'debug',
    'page',
    'once',
    'off',
    'on',
    'addSourceMiddleware',
    'addIntegrationMiddleware',
    'setAnonymousId',
    'addDestinationMiddleware',
  ];

  // Define a factory to create stubs.
  // These are placeholders for methods in Analytics.js so that you never have to wait for it to load to actually record data.
  // The `method` is stored as the first argument, so we can replay the data.
  analytics.factory = function (method: any) {
    return function (...args: any) {
      args.unshift(method);
      analytics.push(args);

      return analytics;
    };
  };

  // For each of our methods, generate a queueing stub.
  for (let i = 0; i < analytics.methods.length; i++) {
    const key = analytics.methods[i];

    analytics[key] = analytics.factory(key);
  }

  // Define a method to load Analytics.js from our CDN, and that will be sure to only ever load it once.
  analytics.load = function (key: any, options: any) {
    // Create an async script element based on your key.
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.segment.com/analytics.js/v1/${key}/analytics.min.js`;

    // Insert our script next to the first script element.
    const first = document.getElementsByTagName('script')[0];

    first?.parentNode?.insertBefore(script, first);
    analytics._loadOptions = options;
  };

  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = '4.1.0';

  // Load Analytics.js with your key, which will automatically load the tools you've enabled for your account.
  analytics.load(segmentWriteKey);
};

export const addAnalyticsToKAuthUI = () => {
  if (!window.konnect) {
    // Since we are setting these properties below, this is just a fallback.
    // We "cheat" a little here on the type so as to avoid a non null assertion in every other usage of`konnect` in the app.
    window.konnect = {
      identify,
      page,
      reset,
      track,
    };
  } else {
    // Note, these are intentionally added individually (rather than assigning to a variable then doing `window.konnect = myVariable`) so as not to overwrite other utilities in the `konnect` global.
    window.konnect.identify = identify;
    window.konnect.page = page;
    window.konnect.reset = reset;
    window.konnect.track = track;
  }
};

interface Options {
  segmentWriteKey: string;
}

/** Initializes Segment analytics */
export const initializeAnalytics = ({ segmentWriteKey }: Options) => {
  loadSegment(segmentWriteKey);
  addAnalyticsToKAuthUI();
};
