package test

import (
	"database/sql"
	"ig-model-generator/services"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

func TestService(t *testing.T) {

	db, err := sql.Open("sqlite3", "../main.db")
	if err != nil {
		t.Error(err)
		return
	}

	service := services.NewService(db)

	names, err := service.GetModelNames(false)
	if err != nil {
		t.Error(err)
		return
	}

	if len(names) < 1 {
		t.Error("Expected at least one name")
		return
	}

	_, err = service.GetRandomModelImages(names[0], 5)
	if err != nil {
		t.Error(err)
		return
	}

}
