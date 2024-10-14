import _ from 'lodash'
import { CollectionBeforeValidateHook } from 'payload'
// import { getClientIp } from 'request-ip'

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
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}response=${recaptcha}&remoteip=${IPaddr}`,
    res,
  )
  if (_.get(res, 'success') !== true) {
    throw new Error('recaptcha failed')
  }
  if (_.get(res, 'score', 0) < 0.4) {
    throw new Error(`recaptcha score is low ${res?.score}`)
  }

  return true
}

export const recaptchaGraphqlCheck: CollectionBeforeValidateHook = async (
  { data, req },
) => {
  const payload = req.payload
  const integrition = await payload.findGlobal({ slug: 'Integration' })
  if (integrition.google?.recaptchaSecretKey) {
    const token = req.headers.get('recaptchatoken')
    // const addr = getClientIp(req as any)
    await recaptcheCheck(
      integrition.google?.recaptchaSecretKey || '',
      token || '',
      '',
    )
  }
  return data
}
