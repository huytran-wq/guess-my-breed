import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const GuessForm = () => {
  const [guess, setGuess] = useState("");
  const [correctGuess, setCorrectGuess] = useState("");
  const [guessHistory, setGuessHistory] = useState<string[]>([]);
  const [guessCount, setGuessCount] = useState(0);
  const [breedImageURL, setBreedImageURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (!gameEnded) {
      axios
        .get("https://dog.ceo/api/breeds/image/random")
        .then((response) => {
          setBreedImageURL(response.data.message);

          let breedName = response.data.message.split("/")[4];
          if (breedName.includes("-")) {
            breedName = breedName.split("-").reverse().join(" ");
          }
          setCorrectGuess(breedName);
        })
        .catch((error) =>
          setErrorMessage(
            "Failed to fetch image. Please try reloading the page again."
          )
        );
    }
  }, [gameEnded]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (guess.trim() === "") {
      setErrorMessage("Please enter a guess.");
      return;
    }

    const isCorrectGuess = guess.toLowerCase() === correctGuess.toLowerCase();
    const newGuessHistory = [...guessHistory, guess];

    setGuess("");
    setGuessHistory(newGuessHistory);
    setGuessCount((count) => count + 1);

    if (isCorrectGuess) {
      setGameEnded(true);
    }
  };

  const handleGiveUp = () => {
    setGameEnded(true);
  };

  const handleRestart = () => {
    setGuess("");
    setCorrectGuess("");
    setGuessHistory([]);
    setGuessCount(0);
    setBreedImageURL("");
    setErrorMessage("");
    setGameEnded(false);
  };

  const handleOnChange = (newGuess: string) => {
    setErrorMessage("");
    setGuess(newGuess);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="w-1/2">
        {breedImageURL && (
          <Image
            width={1500}
            height={1500}
            src={breedImageURL}
            alt="dog"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="w-1/2">
        {!gameEnded ? (
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Guess the breed:</span>
                <input
                  name="guess"
                  type="text"
                  value={guess}
                  onChange={(event) => handleOnChange(event.target.value)}
                  autoFocus
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleGiveUp}
                className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
              >
                Give Up
              </button>

              {errorMessage ? (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              ) : null}
            </form>

            {guessCount > 0 && (
              <div>
                <p className="mt-8 text-lg font-bold">Your guesses:</p>
                <ul className="list-disc ml-8">
                  {guessHistory.map((guess, index) => (
                    <li key={index} className="text-lg mt-2">
                      {guess}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p>The correct breed was {correctGuess.toUpperCase()}.</p>
              <p>You guessed {guessCount} times.</p>
            </div>

            <div>
              {guessCount > 0 && (
                <div>
                  <p>Your guesses:</p>
                  <ul className="list-disc pl-5">
                    {guessHistory.map((guess, index) => (
                      <li key={index}>{guess}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessForm;
