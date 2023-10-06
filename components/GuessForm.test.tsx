import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import axios from "axios";
import GuessForm from "./GuessForm";

jest.mock("axios");

describe("GuessForm", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("renders the form", () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    act(() => {
      render(<GuessForm />);
    });
    const breedInput = screen.getByLabelText("Guess the breed:");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(breedInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("displays an error message when submitting an empty guess", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    act(() => {
      render(<GuessForm />);
    });
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });
    const errorMessage = screen.getByText("Please enter a guess.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("displays the correct guess and guess count when the game ends by providing the correct answer", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    act(() => {
      render(<GuessForm />);
    });
    const breedInput = screen.getByLabelText("Guess the breed:");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.change(breedInput, { target: { value: "Afghan Hound" } });
    await act(() => {
      fireEvent.click(submitButton);
    });
    waitFor(() => {
      const correctGuess = screen.getByText(
        "The correct breed was AFGHAN HOUND."
      );
      expect(correctGuess).toBeInTheDocument();
      const guessCount = screen.getByText("You guessed 1 times.");
      expect(guessCount).toBeInTheDocument();
    });
  });

  test("displays the guess history when the game ends", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    act(() => {
      render(<GuessForm />);
    });
    const breedInput = screen.getByLabelText("Guess the breed:");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.change(breedInput, { target: { value: "Afghan Hound" } });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const guessHistory = screen.getByText("Your guesses:");
      expect(guessHistory).toBeInTheDocument();
      const guessItem = screen.getByText("Afghan Hound");
      expect(guessItem).toBeInTheDocument();
    });
  });

  test("resets the game state when restarting the game", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    act(() => {
      render(<GuessForm />);
    });
    const breedInput = screen.getByLabelText("Guess the breed:");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.change(breedInput, { target: { value: "Afghan Hound" } });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    waitFor(() => {
      const restartButton = screen.getByRole("button", { name: "Restart" });
      fireEvent.click(restartButton);
      const breedInput = screen.getByLabelText("Guess the breed:");
      expect(breedInput).toHaveValue("");
      const submitButton = screen.getByRole("button", { name: "Submit" });
      expect(submitButton).toBeInTheDocument();
      const guessHistory = screen.queryByText("Your guesses:");
      expect(guessHistory).not.toBeInTheDocument();
    });
  });
});
