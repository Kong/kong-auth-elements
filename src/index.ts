/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineCustomKongElement } from '@/utils'
import KAuthApp from '@/KAuthApp.ce.vue'
import router from '@/router'
import { store } from '@/store'

// Kongponents
import KInput from '@kongponents/kinput'
import KCard from '@kongponents/kcard'
import KAlert from '@kongponents/kalert'
import KLabel from '@kongponents/klabel'
import KButton from '@kongponents/kbutton'
import KIcon from '@kongponents/kicon'
import KCheckbox from '@kongponents/kcheckbox'
import KSkeleton from '@kongponents/kskeleton'
import Kooltip from '@kongponents/kooltip'

export default (() => {
  customElements.define(
    'kong-auth',
    defineCustomKongElement(KAuthApp, {
      // @ts-ignore
      plugins: [router, store],
      components: [
        // @ts-ignore
        KInput, KCard, KAlert, KLabel, KButton, KIcon, KCheckbox, KSkeleton, Kooltip
      ]
    })
  )
})()
