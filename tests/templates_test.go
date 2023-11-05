package test

import (
	"html/template"
	"ig-model-generator/models"
	"os"
	"testing"
)

func TestTemplates(t *testing.T) {
	tmpl, err := template.ParseGlob("../templates/**/*.tmpl")
	if err != nil {
		t.Error(err)
		return
	}

	collection := []models.Image{
		models.Image{
			ID:     1,
			URL:    "https://plus.unsplash.com/premium_photo-1666264200744-51f90d07c09e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			Prompt: "sample prompt",
			Name:   "some-person",
		},
	}

	collections := [][]models.Image{
		collection,
	}

	d := models.HomePageData{
		PageTitle:       "test",
		MetaDescription: "description",
		Collections:     collections,
		SiteTitle:       "virtual vogue",
		Names:           []string{"Sean", "Steven"},
	}

	err = tmpl.ExecuteTemplate(os.Stdout, "home", d)
	if err != nil {
		t.Error(err)
	}
}
