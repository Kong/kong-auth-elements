<template>
  <KAlert appearance="danger" class="error-message" data-testid="kong-auth-error-message">
    <template v-if="passwordRequirements.length" #alertMessage>
      <p>{{ capitalizeFirstChar(errorMessage) }}:</p>
      <ul>
        <li v-for="(error, idx) in passwordRequirements" :key="idx">
          {{ capitalizeFirstChar(passwordRequirements[idx]) }}
        </li>
      </ul>
    </template>
    <template v-else #alertMessage>
      {{ errorMessage }}
    </template>
  </KAlert>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { helpText } from '@/utils'
import KAlert from '@kongponents/kalert'

export default defineComponent({
  name: 'ErrorMessage',

  props: {
    error: {
      type: Object,
      required: true,
    },
  },

  components: {
    KAlert,
  },

  setup(props) {
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
      const { status, statusText } = props?.error

      if (status === 401) {
        errorMessage.value = helpText.login.unauthenticated
      } else if (status === 403) {
        // see https://konghq.atlassian.net/browse/KHCP-591 for more information as to why this response was mutated
        errorMessage.value = helpText.general.invalidAccessCode
      } else if (status === 503) {
        errorMessage.value = helpText.general.serviceUnavailable
      } else if (!status && statusText) {
        // Allow passing no status with statusText for display
        errorMessage.value = statusText
      } else {
        errorMessage.value = `Error ${status}: ${statusText}`
      }
    }

    onMounted(() => {
      const { data } = props?.error

      if (data?.errors?.length) {
        const errorDetail = data.errors[0]?.detail

        if (errorDetail?.includes('password')) {
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

    return {
      capitalizeFirstChar,
      errorMessage,
      passwordRequirements,
    }
  },
})
</script>

<style lang="scss" scoped>
.error-message li {
  list-style-type: disc;
}
</style>
