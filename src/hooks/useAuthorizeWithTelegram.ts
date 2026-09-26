
import { useEffect } from "react"

export function useAuthorizeWithTelegram() {
	useEffect(() => {
		const init = async () => {
		
			if (typeof window === 'undefined') return

			const { default: WebApp } = await import("@twa-dev/sdk")
			const initData = WebApp.initData

			if (!initData) {
				console.log('no initData')
				return
			}


			try {
				const response = await fetch('/api/auth/authorize', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ initData }),
				})
        if (response.ok) window.dispatchEvent(new Event('telegram-authenticated'));
			} catch (e) {
				console.error('[auth] Failed to send initData', e)
			}
		}

		init()
	}, [])
}
