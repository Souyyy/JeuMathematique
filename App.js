import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';

// Constantes du jeu
const MAX_NUMBER = 50;
const MAX_TIME_FACILE = 30;
const MAX_TIME_DIFFICILE = 15;

// Generation d'un nombre aleatoire
const rndNumber = () => {
  return Math.floor(Math.random() * MAX_NUMBER);
};

// Formatage du temps pour affichage
const formatTime = (time) => {
  if (time < 10) {
    return '00 : 0' + time;
  } else {
    return '00 : ' + time;
  }
}

export default function App() {
  // Etats pour le mode de jeu et les nombres
  const [modeJeu, setModeJeu] = useState(null);
  const [numberOne, setNumberOne] = useState(rndNumber());
  const [numberTwo, setNumberTwo] = useState(rndNumber());
  const [numberThree, setNumberThree] = useState(rndNumber());
  const [solution, setSolution] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [msg, setMsg] = useState('');

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isJeuActive, setJeuActive] = useState(false);
  const [btnEnabled, setBtnEnabled] = useState(true);

  // Calcul de la solution selon le mode de jeu
  useEffect(() => {
    if (modeJeu === 'facile') {
      setSolution(numberOne + numberTwo);
    } else if (modeJeu === 'difficile') {
      setSolution(numberOne + numberTwo + numberThree);
    }
  }, [numberOne, numberTwo, numberThree, modeJeu]);


  // Init du jeu selon le mode
  const startNewGame = () => {
    setTimeLeft(modeJeu === 'facile' ? MAX_TIME_FACILE : MAX_TIME_DIFFICILE);
    setBtnEnabled(true);
    setMsg('');
    setUserAnswer('');
    setNumberOne(rndNumber());
    setNumberTwo(rndNumber());
    setNumberThree(rndNumber());
    setJeuActive(true);
  };

  useEffect(() => {
    if (modeJeu) {
      startNewGame();
    }
  }, [modeJeu]);

  // Timer du jeu
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && isJeuActive) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = Math.max(prev - 1, 0);
          if (newTime === 0) {
            setBtnEnabled(false);
            setMsg('Temps ecoule, la bonne reponse etait ' + solution + ".");
            setJeuActive(false);
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isJeuActive, solution]);

  // Validation de la reponse
  const handleSubmit = () => {
    if (!isJeuActive) return;

    const reponseUtilisateur = parseInt(userAnswer);
    if (reponseUtilisateur === solution) {
      setMsg('Bonne reponse!');
      setScore(score + 1);
      startNewGame();
    } else {
      setMsg('Mauvaise reponse, la solution etait ' + solution + ".");
      // Recreer un nouveau jeu apres 1s
      setTimeout(() => {
        startNewGame();
      }, 2000);
    }
  };

  // Retour au menu principal
  const retourMenu = () => {
    setModeJeu(null);
    setScore(0);
    setMsg('');
    setBtnEnabled(true);
    setJeuActive(false);
  };

  // Affichage du menu de selection du mode de jeu
  if (!modeJeu) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Choisissez un mode de jeu:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Mode Facile" onPress={() => setModeJeu('facile')} />
          <Button title="Mode Difficile" onPress={() => setModeJeu('difficile')} />
        </View>
      </View>
    );
  }

  // Affichage du jeu
  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score actuel: {score}</Text>
      <Text style={styles.time}>{formatTime(timeLeft)}</Text>
      <Text style={styles.calcul}>
        {numberOne} + {numberTwo}
        {modeJeu === 'difficile' ? ` + ${numberThree}` : ''} =
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre reponse"
        keyboardType="numeric"
        onChangeText={setUserAnswer}
        value={userAnswer}
      />
      <Text style={styles.msg}>{msg}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Valider"
          onPress={handleSubmit}
          disabled={!btnEnabled}
        />
        <Button
          title="Retour au menu"
          onPress={retourMenu}
        />
      </View>

    </View>
  );
}

// Styles de l'application
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
    width: 300,
    marginVertical: 20,
  },

  score: {
    fontSize: 20,
    marginBottom: 50,
  },

  time: {
    fontSize: 25,
    marginBottom: 30,
  },

  msg: {
    color: 'red',
    fontSize: 20,
    marginBottom: 20,
  },

  calcul: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  buttonContainer: {
    marginVertical: 10,
    gap: 20,
  },
});
