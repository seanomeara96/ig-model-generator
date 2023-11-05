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
