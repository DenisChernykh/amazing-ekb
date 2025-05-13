// src/hooks/useAuthorizeWithTelegram.ts
import { useEffect } from "react"

export function useAuthorizeWithTelegram() {
	useEffect(() => {
		const init = async () => {
			// Гарантированно на клиенте: импортируем SDK
			if (typeof window === 'undefined') return

			const { default: WebApp } = await import("@twa-dev/sdk")
			const initData = WebApp.initData



			if (!initData) return


			try {
				await fetch('/api/auth/authorize', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ initData }),
				})
			} catch (e) {
				console.error('[auth] Failed to send initData', e)
			}
		}

		init()
	}, [])
}