import { Heading, VStack, Text, useToast } from "native-base";
import Logo from '../assets/logo.svg';
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";

export function New() {
	const [title, setTitle] = useState()
	const [isLoading, setIsLoading] = useState(false);

	const toast = useToast();
	async function handlePollCreate() {
		if (!title.trim()) {
			return toast.show({
				title: 'Informe um nome para o seu bolão',
				placement: 'top',
				bgColor: 'red.500'
			})
		}
		try {
			setIsLoading(true);

			await api.post('/pools', { title })
			toast.show({
				title: 'Enviado com sucesso',
				placement: 'top',
				bgColor: 'green.500'
			})

		} catch (error) {
			console.log(error);
			toast.show({
				title: 'Deu erro',
				placement: 'top',
				bgColor: 'red.500'
			})
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Criar novo bolão" />

			<VStack mt={8} mx={5} alignItems="center">
				<Logo />
				<Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
					Crie seu próprio bolão da copa e compartilhe entre amigos</Heading>
				<Input mb={2}
					placeholder="Qual o nome do seu bolão?"
					onChangeText={value => setTitle(value)}
					value={title} />
				<Button onPress={handlePollCreate} title="CRIAR MEU BOLÃO" isLoading={isLoading} />
				<Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
					Após criar o seu bolão, você receberá um código único
					que poderá usar para convidar outras pessoas</Text>
			</VStack>
		</VStack>
	)
}