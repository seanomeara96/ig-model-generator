package services

import (
	"context"
	"fmt"
	"ig-model-generator/utils"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/replicate/replicate-go"
)

func (s *Service) CreateGallery(name, description string) error {
	_prompts, err := s.GetAllPrompts()
	if err != nil {
		return err
	}

	prompts := []string{}

	for _, x := range _prompts {
		prompts = append(prompts, x.Prompt)
	}

	log.Printf("Creating gallery for %s", utils.FormatName(name))
	for i, prompt := range prompts {
		log.Printf("Creating image %d of %d", i+1, len(prompts))
		customPrompt := strings.ReplaceAll(prompt, "influencer_name", description)
		imageURL, err := s.GenerateImage(customPrompt)
		if err != nil {
			return err
		}
		destinationFilePath := "images/" + name + generateRandomString(5) + ".png"
		err = downloadImage(imageURL, destinationFilePath)
		if err != nil {
			return err
		}
		q := "INSERT INTO images(url, prompt, name, model, file_path) VALUES (?, ?, ?, ?, ?)"
		_, err = s.db.Exec(q, imageURL, customPrompt, name, os.Getenv("REPLICATE_MODEL"), destinationFilePath)
		if err != nil {
			return err
		}
	}
	return nil
}

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func generateRandomString(length int) string {
	rand.Seed(time.Now().UnixNano())

	result := make([]byte, length)
	for i := 0; i < length; i++ {
		result[i] = charset[rand.Intn(len(charset))]
	}

	return string(result)
}

func (s *Service) GenerateImage(prompt string) (string, error) {
	client, err := replicate.NewClient(replicate.WithTokenFromEnv())
	if err != nil {
		return "", err
	}
	version := os.Getenv("REPLICATE_MODEL")
	input := replicate.PredictionInput{
		"prompt":          prompt,
		"negative_prompt": "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
	}
	prediction, err := client.CreatePrediction(context.Background(), version, input, nil, false)
	if err != nil {
		return "", err
	}
	return *prediction.CompletedAt, nil
}

func downloadImage(imageURL, destinationFilePath string) error {
	// Perform an HTTP GET request to download the image
	response, err := http.Get(imageURL)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("HTTP request failed with status: %s", response.Status)
	}

	// Create the destination file
	file, err := os.Create(destinationFilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Copy the image content to the destination file
	_, err = io.Copy(file, response.Body)
	if err != nil {
		return err
	}

	return nil
}
