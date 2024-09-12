import _ from 'lodash'
import type { BasePayload, Endpoint } from 'payload'
import { getToken } from 'next-auth/jwt'
import recaptcheCheck from './checkRecaptcha'
import { getClientIp } from 'request-ip'

export async function getUserName(req: Request): Promise<string> {
  const token = await getToken({
    salt: 'authjs.session-token',
    secret:
      process.env.AUTH_SECRET ||
      'LBYSoSgn/6ndkbfkvQ9IJJ6s545UqjjGa86dUKSmJVMjbKth',
    req: req,
  })

  return token?.name || ''
}

async function check_request<User>(
  loginRequired: boolean,
  endpoint: string,
  req: Request,
  payload: BasePayload,
): Promise<{ user: User | null; body: any }> {
  const body = await req.json()
  const userID = await getUserName(req)

  payload.logger.info({ body }, `${endpoint} ${userID}`)

  if (userID) {
    const user = (await payload.findByID({
      collection: 'users',
      id: userID,
    })) as any

    if (!user || user.role != 'member') {
      if (loginRequired) throw new Error('Unauthorized')
      return { user: null, body }
    }
    return { user, body }
  } else {
    if (loginRequired) throw new Error('Unauthorized')
    return { user: null, body }
  }
}

export function new_endpoint<User, T>(
  endpoint: string,
  loginRequired: boolean,
  recaptchaCheck: boolean,
  check_args: (body: any, user: User | null) => T,
  process: (
    args: T,
    payload: BasePayload,
    user: User | null,
  ) => Promise<Response>,
): Endpoint {
  return {
    path: endpoint,
    method: 'post',
    handler: async (req) => {
      try {
        const payload = req.payload
        const integrition = await payload.findGlobal({ slug: 'Integration' })
        if (integrition.google?.recaptchaClientKey && recaptchaCheck) {
          const token = req.headers.get('recaptchatoken')
          const addr = getClientIp(req)
          console.log(token, addr)
          const res = await recaptcheCheck('', token || '', addr || '')
          console.log(res)
        }
        const { user, body } = await check_request<User>(
          loginRequired,
          endpoint,
          req as Request,
          payload,
        )
        const args = check_args(body, user)

        return await process(args, payload, user)
      } catch (error) {
        req.payload.logger.error(error)
        return Response.json({ errors: _.get(error, 'message') })
      }
    },
  }
}
