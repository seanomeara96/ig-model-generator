package test

import (
	"database/sql"
	"html/template"
	"ig-model-generator/models"
	"ig-model-generator/services"
	"os"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

func TestTemplates(t *testing.T) {
	db, err := sql.Open("sqlite3", "../main.db")
	if err != nil {
		t.Error(err)
		return
	}

	service := services.NewService(db)

	tmpl, err := template.ParseGlob("../templates/**/*.tmpl")
	if err != nil {
		t.Error(err)
		return
	}

	names, err := service.GetModelNames(true)
	if err != nil {
		t.Error(err)
		return
	}

	collections := [][]models.Image{}
	for _, name := range names {
		collection, err := service.GetRandomModelImages(name, 5)
		if err != nil {
			t.Error(err)
			return
		}
		collections = append(collections, collection)
	}

	c := models.CommonPageData{
		PageTitle:       "test",
		MetaDescription: "description",
		SiteTitle:       "virtual vogue",
		Names:           names,
	}

	d := models.HomePageData{
		CommonPageData: c,
		Collections:    collections,
	}

	err = tmpl.ExecuteTemplate(os.Stdout, "home", d)
	if err != nil {
		t.Error(err)
		return
	}

	modelImages, err := service.GetRandomModelImages(names[0], 5)
	if err != nil {
		t.Error(err)
		return
	}

	gd := models.ModelGalleryData{
		CommonPageData: c,
		Images:         modelImages,
	}

	err = tmpl.ExecuteTemplate(os.Stdout, "modelgallery", gd)
	if err != nil {
		t.Error(err)
		return
	}
}
