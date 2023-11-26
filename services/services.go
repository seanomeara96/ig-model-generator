package services

import (
	"database/sql"
	"ig-model-generator/models"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{db}
}

func (s *Service) GetModelNames(randomOrder bool) ([]string, error) {
	names := []string{}
	q := "SELECT DISTINCT name FROM images"
	if randomOrder {
		q += " ORDER BY RANDOM()"
	}

	rows, err := s.db.Query(q)
	if err != nil {
		return names, err
	}
	defer rows.Close()

	for rows.Next() {
		var name string
		err := rows.Scan(&name)
		if err != nil {
			return names, err
		}
		names = append(names, name)
	}

	return names, nil
}

func (s *Service) GetRandomImages(limit int) ([]models.Image, error) {
	images := []models.Image{}
	q := "SELECT id, file_path as url, prompt, name FROM images ORDER BY RANDOM() LIMIT ?"
	rows, err := s.db.Query(q, limit)
	if err != nil {
		return images, err
	}
	defer rows.Close()

	for rows.Next() {
		image := models.Image{}
		err = rows.Scan(&image.ID, &image.URL, &image.Prompt, &image.Name)
		if err != nil {
			return images, err
		}
		images = append(images, image)
	}

	return images, nil
}

func (s *Service) GetRandomModelImages(name string, limit int) ([]models.Image, error) {
	images := []models.Image{}
	q := "SELECT id, file_path as url, prompt, name FROM images WHERE name = ? ORDER BY RANDOM() LIMIT ?"
	rows, err := s.db.Query(q, name, limit)
	if err != nil {
		return images, err
	}
	defer rows.Close()

	for rows.Next() {
		image := models.Image{}
		err = rows.Scan(&image.ID, &image.URL, &image.Prompt, &image.Name)
		if err != nil {
			return images, err
		}
		images = append(images, image)
	}

	return images, nil
}

func (s *Service) DeleteImageByID(id int) error {
	q := "DELETE FROM images WHERE  id = ?"
	_, err := s.db.Exec(q, id)
	return err
}

func (s *Service) GetAllModelImages(name string) ([]models.Image, error) {
	images := []models.Image{}
	q := "SELECT id, file_path as url, prompt, name FROM images WHERE name = ?"
	rows, err := s.db.Query(q, name)
	if err != nil {
		return images, err
	}
	defer rows.Close()

	for rows.Next() {
		image := models.Image{}
		err := rows.Scan(&image.ID, &image.URL, &image.Prompt, &image.Name)
		if err != nil {
			return images, err
		}
		images = append(images, image)
	}

	return images, nil
}

func (s *Service) GetImageByID(id int) (models.Image, error) {
	image := models.Image{}
	q := "SELECT id, file_path as url, prompt, name FROM images WHERE id = ?"
	err := s.db.QueryRow(q, id).Scan(&image.ID, &image.URL, &image.Prompt, &image.Name)
	if err != nil {
		return image, err
	}
	return image, nil
}

func (s *Service) GetImageFilePathByID(id int) (string, error) {
	var filepath string
	q := "SELECT file_path FROM images WHERE id = ?"
	err := s.db.QueryRow(q, id).Scan(&filepath)
	if err != nil {
		return filepath, err
	}
	return filepath, nil
}

func (s *Service) GetAllPrompts() ([]models.Prompt, error) {
	prompts := []models.Prompt{}
	q := "SELECT id, scenario, prompt FROM prompts"
	rows, err := s.db.Query(q)
	if err != nil {
		return prompts, err
	}
	defer rows.Close()

	for rows.Next() {
		var prompt models.Prompt
		err := rows.Scan(&prompt.ID, &prompt.Scenario, &prompt.Prompt)
		if err != nil {
			return prompts, err
		}
		prompts = append(prompts, prompt)
	}

	return prompts, nil
}

func (s *Service) GetPromptsByScenario(scenario string) ([]models.Prompt, error) {
	prompts := []models.Prompt{}
	q := "SELECT id, scenario, prompt FROM prompts WHERE scenario = ?"
	rows, err := s.db.Query(q, scenario)
	if err != nil {
		return prompts, err
	}
	defer rows.Close()

	for rows.Next() {
		var prompt models.Prompt
		err := rows.Scan(&prompt.ID, &prompt.Scenario, &prompt.Prompt)
		if err != nil {
			return prompts, err
		}
		prompts = append(prompts, prompt)
	}

	return prompts, nil
}

func (s *Service) GetAllScenarios() ([]string, error) {
	q := "SELECT DISTINCT scenario FROM prompts"
	rows, err := s.db.Query(q)
	if err != nil {
		return []string{}, err
	}
	defer rows.Close()

	scenarios := []string{}
	for rows.Next() {
		var scenario string
		err = rows.Scan(&scenario)
		if err != nil {
			return []string{}, err
		}
		scenarios = append(scenarios, scenario)
	}

	return scenarios, nil
}

func (s *Service) GetRandomPrompt() (string, error) {
	var prompt string
	q := "SELECT prompt FROM prompts ORDER BY RANDOM() LIMIT 1"
	err := s.db.QueryRow(q).Scan(&prompt)
	if err != nil {
		return prompt, err
	}
	return prompt, nil
}
