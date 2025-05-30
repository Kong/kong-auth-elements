<template>
  <!-- NOTE: alert-message is added for backwards compatibility of host apps that arent using kongponents alpha -->
  <KAlert
    :alert-message="errorMessage"
    appearance="danger"
    class="kong-auth-error-message error-message"
    data-testid="kong-auth-error-message"
  >
    <template
      v-if="passwordRequirements.length"
      #default
    >
      <p>{{ capitalizeFirstChar(errorMessage) }}:</p>
      <ul>
        <li
          v-for="(err, idx) in passwordRequirements"
          :key="idx"
        >
          {{ capitalizeFirstChar(err) }}
        </li>
      </ul>
    </template>
    <template
      v-else
      #default
    >
      {{ errorMessage }}
    </template>
  </KAlert>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useConfigOptions from '@/composables/useConfigOptions'
import useI18n from '@/composables/useI18n'
import { KAlert } from '@kong/kongponents'

const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
})

const { lang } = useConfigOptions()
const { messages } = useI18n(lang)
const errorMessage = ref('')
const passwordRequirements = ref([])

// Capitalize the first character in the string
// and leave the rest of the string alone
const capitalizeFirstChar = (s: string): string => {
  if (typeof s !== 'string') return s

  const str = s.trim()
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const setGeneralErrorMessage = (): void => {
  // v1 responses
  const { status, statusText, data } = props.error || null
  const errorDetail = data && data.errors ? data.errors[0]?.detail : null

  if (status === 401) {
    errorMessage.value = messages.login.unauthenticated
  } else if (status === 403) {
    // see https://konghq.atlassian.net/browse/KHCP-591 for more information as to why this response was mutated
    errorMessage.value = messages.general.invalidAccessCode
  } else if (status === 503) {
    errorMessage.value = messages.general.serviceUnavailable
  } else if (status === 429) {
    errorMessage.value = messages.general.rateLimited
  } else if (data && data.invalid_parameters && data.invalid_parameters?.length) {
    const { field, reason } = data.invalid_parameters[0]
    // v2 API error response
    let v2Message = capitalizeFirstChar(field) + ' ' + reason
    // For now, replace the first word if repeated
    if (v2Message.includes(capitalizeFirstChar(field) + ' ' + capitalizeFirstChar(field))) {
      v2Message = v2Message.replace(`${capitalizeFirstChar(field)} `, '')
    }
    errorMessage.value = v2Message
  } else if (data && data.detail) {
    // v2 API error response
    errorMessage.value = data.detail
  } else if (!status && statusText) {
    // Allow passing no status with statusText for display
    errorMessage.value = statusText
  } else if (status && errorDetail) {
    errorMessage.value = capitalizeFirstChar(errorDetail)
  } else {
    errorMessage.value = `Error ${status}: ${statusText}`
  }
}

onMounted(() => {
  const { data } = props.error || null

  if (data?.errors?.length) {
    const errorDetail = data.errors[0]?.detail

    // If password requirements error
    if (errorDetail?.includes('password') && errorDetail?.includes('requirement')) {
      const errorArr = errorDetail.split(':')

      errorMessage.value = errorArr[0]
      passwordRequirements.value = errorArr[1].split(',')
    } else {
      setGeneralErrorMessage()
    }
  } else {
    setGeneralErrorMessage()
  }
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@use "@/assets/styles/elements" as *;
</style>
