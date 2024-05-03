package services

import (
	"database/sql"
	"testing"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

func newsvc() (*Service, *sql.DB) {
	err := godotenv.Load("../.env")
	if err != nil {
		panic(err)
	}
	db, err := sql.Open("sqlite3", "../main.db")
	if err != nil {
		panic(err)
	}

	s := NewService(db)
	return s, db
}

func TestGetPromptArray(t *testing.T) {
	s, db := newsvc()
	defer db.Close()

	prompts, err := s.getPromptArray()
	if err != nil {
		t.Errorf("Could not get prompt array %v", err)
		return
	}

	if len(prompts) < 1 {
		t.Error("There should be prompts")
	}
}

func TestInsertInfluencerDescription(t *testing.T) {
	prompt := `insert influencer_name here`
	description := `fake name`
	expect := `insert fake name here`

	res := insertInfluencerDescription(prompt, description)

	if res != expect {
		t.Errorf("Expected %s. Received %s instead.", expect, res)
	}
}

func TestCreateImage(t *testing.T) {
	s, db := newsvc()
	defer db.Close()

	_, err := s.GenerateImage("A middle aged Irish man with uneven brown hair and a big crooked nose, photographic, ordinary")
	if err != nil {
		t.Errorf("Could not generate image. %v", err)
		return
	}
}
