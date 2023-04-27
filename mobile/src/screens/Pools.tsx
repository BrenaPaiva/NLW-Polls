import { VStack, Icon, FlatList } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { api } from "../services/api";
import { PoolCard, PoolCardPros } from "../components/PoolCard";

import { Loading } from "../components/Loading";
import { useState, useCallback } from "react";
import { useToast } from "native-base";
import { EmptyPoolList } from "../components/EmptyPoolList";

import { useFocusEffect } from "@react-navigation/native";


export function Pools() {
	const [isLoading, setIsLoading] = useState(true);
	const [pools, setPools] = useState<PoolCardPros[]>([]);

	const { navigate } = useNavigation();

	const toast = useToast();

	async function fetchPools() {
		try {
			setIsLoading(true);
			const response = await api.get('/pools')
			setPools(response.data.pools) //2446
		} catch (error) {
			console.log(error);

			toast.show({
				title: 'nao foi possivel carregar os bolões',
				placement: 'top',
				bgColor: 'red.500'
			})
		} finally {
			setIsLoading(false)
		}
	}

	useFocusEffect(useCallback(() => {
		fetchPools()
	}))
	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Meus bolões" />
			<VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor={"gray.600"} pb={4} mb={4}>
				<Button title="BUSCAR BOLÃO POR CÓDIGO"
					leftIcon={<Icon as={Octicons}
						name="search"
						color="black"
						size="md" />}
					onPress={() => navigate('find')} />
			</VStack>

			{isLoading ? <Loading /> :
				<FlatList
					data={[]}
					keyExtractor={item => item.id}
					renderItem={({ item }) => <PoolCard data={item} />}
					px={5}
					showsVerticalScrollIndicator={false}
					_contentContainerStyle={{ pb: 10 }}
					ListEmptyComponent={<EmptyPoolList />}

				/>}
		</VStack>
	)
}