package main

import (
	"database/sql"
	"flag"
	"fmt"
	"html/template"
	"ig-model-generator/models"
	"ig-model-generator/services"
	"ig-model-generator/utils"
	"log"
	"net/http"
	"strconv"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

func main() {

	port := flag.String("port", "", "port")

	flag.Parse()

	if *port == "" {
		panic("must supply port")
	}

	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	db, err := sql.Open("sqlite3", "main.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	styleSheet := "main6.css"

	var commonPageData = models.CommonPageData{
		SiteTitle:  "Virtual Vogue",
		Env:        "dev",
		StyleSheet: styleSheet,
	}

	funcMap := template.FuncMap{
		"FormatName": utils.FormatName,
	}
	tmpl, err := template.New("ai-influencers").Funcs(funcMap).ParseGlob("./templates/**/*.tmpl")
	if err != nil {
		panic(err)
	}

	service := services.NewService(db)
	names, err := service.GetModelNames(false)
	if err != nil {
		panic(err)
	}
	commonPageData.Names = names

	r := http.NewServeMux()

	assetsFS := http.FileServer(http.Dir("assets"))
	imagesFS := http.FileServer(http.Dir("images"))
	r.Handle("/assets/", http.StripPrefix("/assets/", assetsFS))
	r.Handle("/images/", http.StripPrefix("/images/", imagesFS))

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		modelNames, err := service.GetModelNames(false)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		var collections [][]models.Image
		for i, name := range modelNames {
			if i > 4 {
				break
			}
			collection, err := service.GetRandomModelImages(name, 1)
			if err != nil {
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}
			collections = append(collections, collection)
		}

		base := models.BasePageData{
			CommonPageData:  commonPageData,
			PageTitle:       "Virtual Modelling Agency",
			MetaDescription: "Welcome to virtual vogue, the virtual ai modelling agency",
		}

		d := models.HomePageData{
			BasePageData: base,
			Collections:  collections,
		}

		if err := tmpl.ExecuteTemplate(w, "home", d); err != nil {
			log.Printf("[ERROR] Could not execute home template. %v", err)
		}
	})

	r.HandleFunc("GET /models/", func(w http.ResponseWriter, r *http.Request) {
		names, err := service.GetModelNames(false)
		if err != nil {
			w.WriteHeader(500)
			return
		}

		d := map[string]any{
			"CommonPageData":  commonPageData,
			"PageTitle":       "Virtual Models",
			"MetaDescription": "See the full list of virtual models",
			"Names":           names,
		}

		if err := tmpl.ExecuteTemplate(w, "models", d); err != nil {
			log.Printf("[ERROR] Could not render models page. %v", err)
		}

	})

	r.HandleFunc("GET /models/{name}", func(w http.ResponseWriter, r *http.Request) {
		name := r.PathValue("name")
		qVals := r.URL.Query()
		pageStr := qVals.Get("page")
		page := 1
		limit := 6
		if pageStr != "" {
			p, err := strconv.Atoi(pageStr)
			if err != nil {
				w.WriteHeader(500)
				return
			}
			if p == 0 {
				page = 1
			} else {
				page = p
			}
		}

		offset := limit * (page - 1)

		base := models.BasePageData{
			CommonPageData:  commonPageData,
			PageTitle:       "Virtual Modelling Agency",
			MetaDescription: "Welcome to virtual vogue, the virtual ai modelling agency",
		}
		params := services.GetImageParams{
			Name:   name,
			Limit:  limit,
			Offset: offset,
		}
		images, err := service.GetModelImages(params)
		if err != nil {
			log.Printf("Error getting model images. %v", err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		if page == 1 {
			gd := models.ModelGalleryData{
				BasePageData: base,
				Images:       images,
				NextPage:     page + 1,
			}
			if err := tmpl.ExecuteTemplate(w, "modelgallery", gd); err != nil {
				log.Printf("[ERROR] Could not render model gallery tempalate. %v", err)
			}
		} else {
			if len(images) < 1 {
				w.Write([]byte{})
				return
			}

			data := map[string]interface{}{}
			data["Images"] = images
			data["NextPage"] = page + 1
			if err := tmpl.ExecuteTemplate(w, "grid", data); err != nil {
				log.Printf("[ERROR] Could not render mode gallery grid template. %v", err)
			}

		}
	})

	r.HandleFunc("GET /prompts", func(w http.ResponseWriter, r *http.Request) {
		scenario := r.URL.Query().Get("scenario")

		prompts, err := []models.Prompt{}, fmt.Errorf("something went wrong fetching prompts")

		if scenario != "" {
			prompts, err = service.GetPromptsByScenario(scenario)
		} else {
			prompts, err = service.GetAllPrompts()
		}

		if err != nil {
			log.Printf("Error getting prompts: %v", err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		scenarios, err := service.GetAllScenarios()
		if err != nil {
			log.Printf("Error getting scenarios: %v", err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		base := models.BasePageData{
			CommonPageData:  commonPageData,
			PageTitle:       "Virtual Modelling Agency",
			MetaDescription: "Welcome to virtual vogue, the virtual ai modelling agency",
		}
		pd := models.PromptListPageData{
			BasePageData: base,
			Prompts:      prompts,
			Scenarios:    scenarios,
		}

		err = tmpl.ExecuteTemplate(w, "prompts", pd)
		if err != nil {
			log.Printf("Error: %v", err)
		}
	})

	r.HandleFunc("GET /create", func(w http.ResponseWriter, r *http.Request) {
		prompt, err := service.GetRandomPrompt()
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		base := models.BasePageData{
			CommonPageData:  commonPageData,
			PageTitle:       "create a model",
			MetaDescription: "create a model",
		}

		cpd := models.ModelCreationPageData{
			BasePageData: base,
			SamplePrompt: prompt,
		}

		err = tmpl.ExecuteTemplate(w, "createmodel", cpd)
		if err != nil {
			log.Println(err)
		}

	})

	//r.HandleFunc("/random/")
	//r.HandleFunc("/create/")
	//r.HandleFunc("/create/test/")
	//r.HandleFunc("/create/gallery/")
	//r.HandleFunc("/images/{id}/delete/")
	//r.HandleFunc("/images/{id}/edit/")

	log.Println("Listening on " + *port)
	http.ListenAndServe(":"+*port, r)
}
