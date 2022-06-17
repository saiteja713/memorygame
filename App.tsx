/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const numColumns = 4;

interface Card {
  key: string;
  id: number;
  matched: boolean;
}

const App = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState<Card | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<Card | null>(null);
  const [matches, setMatches] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const data = [
    {key: 'A', matched: false},
    {key: 'B', matched: false},
    {key: 'C', matched: false},
    {key: 'D', matched: false},
    {key: 'E', matched: false},
    {key: 'F', matched: false},
    {key: 'G', matched: false},
    {key: 'H', matched: false},
  ];
  const shuffleCards = () => {
    const shuffledCards = [...data, ...data]
      .sort(() => Math.random() - 0.5)
      .map(card => ({...card, id: Math.random()}));
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setMatches(0);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.key === choiceTwo.key) {
        setCards(prevCard => {
          return prevCard.map(card => {
            if (card.key === choiceOne.key) {
              setMatches(matches + 1);
              return {...card, matched: true};
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 100);
      }
    }
    if (matches === 8) {
      Alert.alert(
        'Congragulations!,You won the game',
        "Let's start a new game",
        [
          {
            text: 'New game',
            onPress: () => shuffleCards(),
          },
        ],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns): any => prevTurns + 1);
    setDisabled(false);
  };

  const handleChoice = (card: React.SetStateAction<Card | null>) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const handleClick = (card: React.SetStateAction<Card | null>) => {
    console.log('card', card);
    if (!disabled) {
      handleChoice(card);
    }
  };

  useEffect(() => {
    shuffleCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({item}: any) => {
    const flipped = item === choiceOne || item === choiceTwo || item.matched;
    return flipped ? (
      <TouchableOpacity
        style={item.matched ? styles.matchedItem : styles.item}
        disabled={item.matched}>
        <Text style={styles.itemText}>{item.key}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => handleClick(item)} style={styles.item} />
    );
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View>
        <View style={styles.heading}>
          <Text style={styles.count}>Turns: {turns}</Text>
          <Text style={styles.count}>Matches: {matches}</Text>
        </View>
        <Button title="New Game" onPress={shuffleCards} />
        <FlatList
          numColumns={numColumns}
          horizontal={false}
          data={cards}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  heading: {
    alignItems: 'center',
  },
  count: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  item: {
    backgroundColor: '#4D243D',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: (Dimensions.get('window').height - 50) / numColumns, // approximate a square
  },
  matchedItem: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: (Dimensions.get('window').height - 50) / numColumns, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});

export default App;
