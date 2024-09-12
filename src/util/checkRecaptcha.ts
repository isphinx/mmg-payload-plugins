import _ from 'lodash'

export default async function recaptcheCheck(
  secret: string,
  recaptcha: string,
  IPaddr: string,
): Promise<boolean> {
  if (!recaptcha) throw new Error('no recaptcha')

  const res = await (
    await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptcha}&remoteip=${IPaddr}`,
    )
  ).json()

  console.log(
    `https://www.google.com/recaptcha/api/siteverify?secret=6LfTeHwiAAAAANrp15BbX0tDbsbhYnSYSr2M6qrW&response=${recaptcha}&remoteip=${IPaddr}`,
    res,
  )
  if (_.get(res, 'success') !== true) throw new Error('recaptcha failed')
  if (_.get(res, 'score', 0) < 0.4)
    throw new Error(`recaptcha score is low ${res?.score}`)

  return true
}
