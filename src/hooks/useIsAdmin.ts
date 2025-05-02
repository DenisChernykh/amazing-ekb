import { useEffect, useState } from "react";

export function useIsAdmin() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const checkUser = async () => {
			try {
				console.log('checkUser');

				const res = await fetch('/api/auth/me');
				const data = await res.json();

				setIsAdmin(data.user?.role === 'ADMIN');
			} catch (e) {
				console.error('Ошибка при проверке роли', e);
			} finally {
				setLoading(false);
			}
		};
		checkUser();
	}, []);
	return { isAdmin, loading };
}