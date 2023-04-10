/**
 * Define shared emit values for `defineEmits`
 */

// AcceptInvitationForm.vue
export const acceptInvitationEmits = {
  'accept-invitation-success': (payload: { email: string }): boolean => {
    return !!payload?.email.trim()
  },
}

// ForgotPasswordForm.vue
export const forgotPasswordEmits = {
  'forgot-password-success': (payload: { email: string }): boolean => {
    return !!payload?.email.trim()
  },
  'click-login-link': null,
}

// LoginForm.vue
export const loginEmits = {
  'login-success': null,
  'verify-email-success': (payload: { email: string, resetToken?: string }): boolean => {
    return !!payload?.email.trim()
  },
  'click-forgot-password-link': null,
  'click-register-link': null,
  'idp-is-loading': (payload: { isLoading: boolean }): boolean => {
    return typeof payload?.isLoading === 'boolean'
  },
}

// RegisterForm.vue
export const registerEmits = {
  'register-success': (payload: { email: string, organization: { id: string, name: string }}): boolean => {
    return !!payload?.email.trim() && !!payload?.organization?.id?.trim() && !!payload?.organization?.name?.trim()
  },
}

// ResetPasswordForm.vue
export const resetPasswordEmits = {
  'reset-password-success': (payload: { email: string }): boolean => {
    return !!payload?.email.trim()
  },
}

// ChangePasswordForm.vue
export const changePasswordEmits = {
  'input-new-password': null,
  'change-password-success': null,
}
