import { gql, useQuery } from '@apollo/client';
import { FlatList, StatusBar, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddRecipe } from '../components/recipe/AddRecipe';
import { RecipeItem } from '../components/recipe/RecipeItem';
import { RootTabScreenProps } from '../types';

const GET_RECIPES = gql`
  query GET_RECIPES {
    recipes {
      id
      title
      description
      ingredients
      createdAt
    }
  }
`;

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const { data } = useQuery(GET_RECIPES);
  const recipes = data?.recipes;

  return (
    <SafeAreaView style={styles.container}>
      <AddRecipe />
      <FlatList
        data={recipes}
        renderItem={({ item }) => <RecipeItem recipe={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.notFound}>No Recipes found</Text>
        }
      />
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  notFound: {
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 10,
    color: '#f87171',
    fontSize: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
