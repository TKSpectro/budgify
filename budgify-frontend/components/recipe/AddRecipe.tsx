import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

const ADD_RECIPE = gql`
  mutation ADD_RECIPE($newRecipeData: NewRecipeInput!) {
    addRecipe(newRecipeData: $newRecipeData) {
      id
      title
      description
      ingredients
    }
  }
`;

export const AddRecipe = () => {
  const [addRecipe] = useMutation(ADD_RECIPE, {
    variables: {
      newRecipeData: {
        title: 'recipe ' + new Date().getTime(),
        ingredients: ['ing1', 'ing2'],
      },
    },
    onError: (error) => console.log('addRecipe error', error),
    update(cache, { data: { addRecipe } }) {
      cache.modify({
        fields: {
          recipes(existingRecipes = []) {
            const newRecipesRef = cache.writeFragment({
              data: addRecipe,
              fragment: gql`
                fragment NewRecipe on Recipe {
                  id
                  title
                  description
                  ingredients
                }
              `,
            });
            return [...existingRecipes, newRecipesRef];
          },
        },
      });
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? 'rgba(255, 255, 255, 0.07)' : '',
        },
        styles.button,
      ]}
      onPress={() => addRecipe()}
    >
      <Text style={styles.buttonText}>+ Recipe</Text>
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  button: {
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#2dd4bf',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
