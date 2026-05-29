import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()

export async function tapLight() {
  if (!isNative) return
  await Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
}

export async function tapMedium() {
  if (!isNative) return
  await Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
}

export async function tapSuccess() {
  if (!isNative) return
  await Haptics.notification({ type: NotificationType.Success }).catch(() => {})
}

export async function tapWarning() {
  if (!isNative) return
  await Haptics.notification({ type: NotificationType.Warning }).catch(() => {})
}
