import KongAuthApi from '@/services/KongAuthApi';
export interface ApiComposable {
    api: KongAuthApi;
    userEntity: 'user' | 'developer';
}
export default function useApi(): ApiComposable;
