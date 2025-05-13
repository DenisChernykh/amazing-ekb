import { useEffect, useState } from "react";

export function useIsAdmin() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
	const [user, setisUser] = useState(null);
	useEffect(() => {
		const checkUser = async () => {
			try {

				const res = await fetch('/api/auth/me', {
					credentials: 'include'
				});
				const data = await res.json();
				setisUser(data.user);
				setIsAdmin(data.user?.role === 'ADMIN');
			} catch (e) {
				console.error('Ошибка при проверке роли', e);
			} finally {
				setLoading(false);
			}
		};
		checkUser();
	}, []);
	return { isAdmin, loading, user };
}