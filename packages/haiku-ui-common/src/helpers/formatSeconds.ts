import * as numeral from 'numeral';

export default function formatSeconds (seconds: string|number) {
  return numeral(seconds).format('0[.]0[0]');
}
