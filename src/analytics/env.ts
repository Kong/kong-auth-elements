export const getSegmentWriteKey = (host?: Location['host']) => {
  /** corresponds to the Segment `WRITE_KEY` for the Segment JavaScript source named `konnect-frontend-prod` */
  const prod = 'EAo0jkNoYGi1gZsjp5Pah8sbZAHXEhTQ';

  /** corresponds to the Segment `WRITE_KEY` for the Segment JavaScript source named `konnect-frontend-dev` */
  const dev = 'BT1RrT3w8svM8F2Y3VPrQgGrMxsA83qe';

  /**
   * corresponds to the Segment `WRITE_KEY` for the Segment JavaScript source named `konnect-frontend-sandbox`
   *
   * use 'mYraiIMesZHrtuJ0mda09yBBg1j0aXO2' to test with konnect segment account sandbox
   * */
  const sandbox = 'placeholder';

  switch (host) {
    case 'konnect.konghq.com':
      return prod;
    case 'konnect-dev.konghq.com':
      return dev;

    default:
      return sandbox;
  }
};
