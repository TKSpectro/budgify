import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { View } from '../Themed';

const REMOVE_RECIPE = gql`
  mutation REMOVE_RECIPE($removeRecipeId: String!) {
    removeRecipe(id: $removeRecipeId)
  }
`;

interface Props {
  recipe: {
    id: string;
    title: string;
    description: string;
    ingredients: string[];
  };
}

export const RecipeItem = ({ recipe }: Props) => {
  const [removeRecipe] = useMutation(REMOVE_RECIPE, {
    variables: { removeRecipeId: recipe.id },
    onError: (error) => console.log('removeRecipe error', error),
    update(cache) {
      const normalizedId = cache.identify({
        __typename: 'Recipe',
        id: recipe.id,
      });
      cache.evict({ id: normalizedId });
      cache.gc();
    },
  });

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Pressable style={styles.button} onPress={() => removeRecipe()}>
        <Text style={styles.buttonText}>X</Text>
      </Pressable>
    </View>
  );
};

export const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    color: '#2dd4bf',
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    paddingHorizontal: 4,
    borderWidth: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: '#f87171',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
