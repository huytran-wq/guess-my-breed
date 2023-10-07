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
    jest.clearAllMocks();
  });

  test("displays the correct breed image on load", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    await act(async () => {
      render(<GuessForm />);
    });
    await waitFor(() => {
      const breedImage = screen.getByAltText("dog");
      expect(breedImage).toBeInTheDocument();
      expect(breedImage).toHaveAttribute(
        "src",
        "/_next/image?url=https%3A%2F%2Fimages.dog.ceo%2Fbreeds%2Fhound-afghan%2Fn02088094_1003.jpg&w=3840&q=75"
      );
    });
  });

  test("displays an error message if breed image fails to load", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValueOnce(
      new Error("Failed to fetch image.")
    );
    await act(async () => {
      render(<GuessForm />);
    });
    await waitFor(() => {
      const errorMessage = screen.getByText(
        "Failed to fetch image. Please try reloading the page again."
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("displays an error message if user submits an empty guess", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    await act(async () => {
      render(<GuessForm />);
    });
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);
    await waitFor(() => {
      const errorMessage = screen.getByText("Please enter a guess.");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("displays the guess history after submitting an incorrect guess", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    await act(async () => {
      render(<GuessForm />);
    });
    const breedInput = screen.getByLabelText("Guess the breed:");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.change(breedInput, { target: { value: "Corgi" } });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const guessHistory = screen.getByText("Your guesses:");
      expect(guessHistory).toBeInTheDocument();
      const guessItem = screen.getByText("Corgi");
      expect(guessItem).toBeInTheDocument();
      const breedInput = screen.getByLabelText("Guess the breed:");
      expect(breedInput).toHaveValue("");
    });
  });

  test("displays the correct message after giving up without providing a guess", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    await act(async () => {
      render(<GuessForm />);
    });
    const giveUpButton = screen.getByRole("button", { name: "Give Up" });
    await act(async () => {
      fireEvent.click(giveUpButton);
    });
    await waitFor(() => {
      const correctBreed = screen.getByText(
        "The correct breed was AFGHAN HOUND."
      );
      expect(correctBreed).toBeInTheDocument();
      const guessCount = screen.getByText("You guessed 0 times.");
      expect(guessCount).toBeInTheDocument();
      const restartButton = screen.getByRole("button", { name: "Restart" });
      expect(restartButton).toBeInTheDocument();
    });
  });

  test("displays the correct message and guess history after giving up with some guesses", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    await act(async () => {
      render(<GuessForm />);
    });

    const breedInput = screen.getByLabelText("Guess the breed:");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.change(breedInput, { target: { value: "Corgi" } });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const giveUpButton = screen.getByRole("button", { name: "Give Up" });
    await act(async () => {
      fireEvent.click(giveUpButton);
    });
    await waitFor(() => {
      const correctBreed = screen.getByText(
        "The correct breed was AFGHAN HOUND."
      );
      expect(correctBreed).toBeInTheDocument();
      const guessCount = screen.getByText("You guessed 1 times.");
      expect(guessCount).toBeInTheDocument();
      const guessHistory = screen.getByText("Your guesses:");
      expect(guessHistory).toBeInTheDocument();
      const restartButton = screen.getByRole("button", { name: "Restart" });
      expect(restartButton).toBeInTheDocument();
    });
  });

  test("resets the form and game state after restarting", async () => {
    const mockResponse = {
      data: {
        message:
          "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );
    await act(async () => {
      render(<GuessForm />);
    });
    const breedInput = screen.getByLabelText("Guess the breed:");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.change(breedInput, { target: { value: "Afghan Hound" } });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(async () => {
      const restartButton = screen.getByRole("button", { name: "Restart" });
      const mockResponse = {
        data: {
          message:
            "https://images.dog.ceo/breeds/hound-corgi/n02088094_1003.jpg",
        },
      };
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockResolvedValueOnce(mockResponse);
      await act(async () => {
        fireEvent.click(restartButton);
      });
    });
    await waitFor(() => {
      const breedImage = screen.getByAltText("dog");
      expect(breedImage).toBeInTheDocument();
      expect(breedImage).toHaveAttribute(
        "src",
        "/_next/image?url=https%3A%2F%2Fimages.dog.ceo%2Fbreeds%2Fhound-corgi%2Fn02088094_1003.jpg&w=3840&q=75"
      );
      const guessInput = screen.getByRole("textbox", {
        name: "Guess the breed:",
      });
      expect(guessInput).toHaveValue("");
      const submitButton = screen.getByRole("button", { name: "Submit" });
      expect(submitButton).toBeInTheDocument();
      const giveUpButton = screen.getByRole("button", { name: "Give Up" });
      expect(giveUpButton).toBeInTheDocument();
    });
  });
});
