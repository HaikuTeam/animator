import numeral from 'numeral'

export default function formatSeconds (seconds) {
  return numeral(seconds).format('0[.]0[0]')
}
