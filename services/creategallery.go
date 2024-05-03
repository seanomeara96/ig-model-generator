package services

import (
	"context"
	"fmt"
	"ig-model-generator/utils"
	"ig-model-generator/utils/image"
	"log"
	"math/rand"
	"os"
	"strings"
	"time"

	"github.com/replicate/replicate-go"
)

func (s *Service) getPromptArray() ([]string, error) {
	_prompts, err := s.GetAllPrompts()
	if err != nil {
		return []string{}, err
	}

	prompts := []string{}
	for _, x := range _prompts {
		prompts = append(prompts, x.Prompt)
	}

	return prompts, nil
}

func insertInfluencerDescription(prompt, description string) string {
	return strings.ReplaceAll(prompt, "influencer_name", "( "+description+" )")
}

func (s *Service) CreateGallery(name, description string) error {
	prompts, err := s.getPromptArray()
	if err != nil {
		return err
	}

	log.Printf("Creating gallery for %s", utils.FormatName(name))
	for i, prompt := range prompts {
		log.Printf("Creating image %d of %d", i+1, len(prompts))

		customPrompt := insertInfluencerDescription(prompt, description)
		imageURL, err := s.GenerateImage(customPrompt)
		if err != nil {
			return err
		}

		destinationFilePath := "images/" + name + generateRandomString(5) + ".png"
		if err = image.Download(imageURL, destinationFilePath); err != nil {
			return err
		}

		q := "INSERT INTO images(url, prompt, name, model, file_path) VALUES (?, ?, ?, ?, ?)"
		if _, err = s.db.Exec(q, imageURL, customPrompt, name, os.Getenv("REPLICATE_MODEL"), destinationFilePath); err != nil {
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
		"prompt":          prompt + " RAW, 16mm, color graded, ultrarealistic, textured skin, remarkable detail, visible skin detail, skin fuzz, dry skin, shot with cinematic camera",
		"negative_prompt": "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
	}

	output, err := client.Run(context.Background(), version, input, nil)
	if err != nil {
		return "", err
	}

	prediction, ok := output.([]interface{})
	if !ok {
		return "", fmt.Errorf("output was not an interface slice")
	}

	return prediction[0].(string), nil
}
