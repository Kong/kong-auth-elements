import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import useConfigOptions from '@/composables/useConfigOptions'

/**
 * Configure the base axios instance
 * @param {AxiosRequestConfig} options The options to pass to the base axios instance
 * @param {'v1' | 'v2'} version The KAuth API version; defaults to `v2`. Once all endpoints are KAuth v2, this property and the baseURL can be removed.
 * @returns axiosInstance
 */
export default function useAxios(options: AxiosRequestConfig = {}, version: 'v1' | 'v2' = 'v2') {
  const { apiBaseUrl } = useConfigOptions()

  const axiosInstance = axios.create({
    baseURL: version === 'v1' ? apiBaseUrl : apiBaseUrl?.replace(/\/kauth$/gi, ''),
    withCredentials: true,
    timeout: 30000,
    ...options,
  })

  return {
    axiosInstance,
  }
}
