import { Heading, VStack, useToast } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react"

export function Find() {
	const [isLoading, setisLoading] = useState(false);

	const toast = useToast()

	async function handleJoinPull() {
		try {

			setisLoading(true)

		} catch (error) {
			console.log(error)

			toast.show({
				title: 'Não foi possivel encontrar o bolão',
				placement: 'top',
				bgColor: 'red.500'
			})
		} finally {
			setisLoading(false)
		}
	}
	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Buscar por código" showBackButton />

			<VStack mt={8} mx={5} alignItems="center">

				<Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
					Encontre seu bolão através de {'\n'}seu código único</Heading>
				<Input mb={2} placeholder="Qual o código do bolão?" />
				<Button title="BUSCAR BOLÃO"
					isLoading={isLoading}
					onPress={handleJoinPull} />

			</VStack>
		</VStack>
	)
}