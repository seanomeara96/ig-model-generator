package image

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func Download(imageURL, destinationFilePath string) error {
	// Perform an HTTP GET request to download the image
	response, err := http.Get(imageURL)
	if err != nil {
		return fmt.Errorf("Could execute get request images.Download. %v", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("HTTP request failed with status: %s", response.Status)
	}

	// Create the destination file
	file, err := os.Create(destinationFilePath)
	if err != nil {
		return fmt.Errorf("Failed to create destination file. %v", err)
	}
	defer file.Close()

	// Copy the image content to the destination file
	_, err = io.Copy(file, response.Body)
	if err != nil {
		return fmt.Errorf("Could not copy image content to destination file. %v", err)
	}

	return nil
}
