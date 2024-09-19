import _ from 'lodash'
import { getToken } from 'next-auth/jwt'
import { BasePayload, PayloadRequest } from 'payload'
import { getClientIp } from 'request-ip'
import recaptcheCheck from './checkRecaptcha'

async function getUser<User>(req: PayloadRequest): Promise<User | null> {
  const token = await getToken({
    salt: 'authjs.session-token',
    secret: process.env.AUTH_SECRET
      || 'LBYSoSgn/6ndkbfkvQ9IJJ6s545UqjjGa86dUKSmJVMjbKth',
    req: req,
  })

  if (token?.name) {
    return await req.payload.findByID({
      collection: 'users',
      id: token.name,
    }) as User
  }

  return null
}

export function graphQLHelper<User>(
  slug: string,
  loginRequired: boolean,
  recaptchaCheck: boolean,
  process: (
    args: any,
    payload: BasePayload,
    user: User | null,
  ) => Promise<object>,
) {
  return async (_obj: any, args: any, context: any, _info: any) => {
    try {
      const user = await getUser<User>(context.req)
      if (loginRequired) {
        if (!user) throw new Error('No User')
      }
      const integrition = await context.req.payload.findGlobal({ slug })
      if (integrition.google?.recaptchaClientKey && recaptchaCheck) {
        const token = context.req.headers.get('recaptchatoken')
        const addr = getClientIp(context.req as any)
        await recaptcheCheck(
          integrition.google?.recaptchaSecretKey || '',
          token || '',
          addr || '',
        )
      }
      return process(args, context.req.payload, user)
    } catch (error) {
      context.req.payload.logger.error(error)
      return Response.json({ errors: _.get(error, 'message') })
    }
  }
}
