'use client'
import React from 'react'
import { load } from 'recaptcha-v3'

export function useRecaptcha(key: string, action: string) {
  const [recaptchaToken, SetRecaptchaToken] = React.useState<string>('')

  const reset = React.useCallback(() => {
    SetRecaptchaToken('')
  }, [])

  React.useEffect(() => {
    if (recaptchaToken == '' && key) {
      load(key, {
        autoHideBadge: true,
        useEnterprise: true,
      }).then((recaptcha) =>
        recaptcha.execute(action).then((token) => SetRecaptchaToken(token))
      )
    }
  }, [recaptchaToken])

  return {
    recaptchaToken,
    reset,
  }
}
