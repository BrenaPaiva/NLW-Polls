import { ReactNode, createContext, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
	name: string,
	avatarUrl: string;
}

export interface AuthContextDataProps {
	user: UserProps;
	isUsingLoading: boolean;
	signIn: () => Promise<void>;
}
interface AuthProviderProps {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);


export function AuthContextProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserProps>({} as UserProps);

	const [isUsingLoading, setUsingLoading] = useState(false);

	const [request, response, promptAsync] = Google.useAuthRequest({
		clientId: '336027319380-i3qnvd2c305gubqg30ko2j4l053og9de.apps.googleusercontent.com',
		redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
		scopes: ['profile', 'email']
	})



	async function signIn() {
		try {
			setUsingLoading(true);
			await promptAsync();
		} catch (error) {
			console.log(error)
			throw error;
		} finally {
			setUsingLoading(false);
		}
	}

	async function signInInWithGoogle(access_token: string) {
		try {
			setUsingLoading(true);

			const tokenResponse = await api.post('/users', { access_token })
			api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

			const userInfoResponse = await api.get('/me');
			setUser(userInfoResponse.data.user);

		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			setUsingLoading(false)
		}
	}
	useEffect(() => {
		if (response?.type === 'success' && response.authentication?.accessToken) {
			signInInWithGoogle(response.authentication.accessToken)
		}
	}, [response])

	return (
		<AuthContext.Provider value={{
			signIn,
			isUsingLoading,
			user: {
				name: 'Brena Paiva',
				avatarUrl: 'https://github.com/BrenaPaiva.png'
			}
		}}>
			{children}
		</AuthContext.Provider>
	)
}