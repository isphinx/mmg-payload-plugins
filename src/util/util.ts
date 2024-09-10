import _ from 'lodash'

export const mobileRegExp = new RegExp(
  /^(?:\+?(61))? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})$/,
)

export const passwordRegExp = new RegExp(/^.{8,}$/)

export function generateStyle(css: string | undefined | null) {
  if (!!css)
    return _.chain(css)
      .split('{')
      .pop()
      .split('}')
      .first()
      .split(';')
      .map((l) => l.trim())
      .filter((l) => !!l)
      .map((l) => l.split(':'))
      .map(([k, v]) => [k.trim(), _.trim(v.trim(), '"')])
      .keyBy((l) => _.camelCase(l[0]))
      .mapValues((l) => l[1])
      .value()
  return {}
}

export function currencyFormat(num: number) {
  let ch = '$'
  if (num < 0) {
    ch = '-$'
    num = num * -1
  }
  return ch + (num * 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
