package main

import (
	"database/sql"
	"flag"
	"html/template"
	"ig-model-generator/models"
	"ig-model-generator/services"
	"ig-model-generator/utils"
	"log"
	"net/http"

	"github.com/gorilla/mux"
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

	r := mux.NewRouter()

	assetsFS := http.FileServer(http.Dir("assets"))
	imagesFS := http.FileServer(http.Dir("images"))
	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", assetsFS))
	r.PathPrefix("/images/").Handler(http.StripPrefix("/images/", imagesFS))

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

		tmpl.ExecuteTemplate(w, "home", d)
	}).Methods(http.MethodGet)

	r.HandleFunc("/models/{name}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		name := vars["name"]

		base := models.BasePageData{
			CommonPageData:  commonPageData,
			PageTitle:       "Virtual Modelling Agency",
			MetaDescription: "Welcome to virtual vogue, the virtual ai modelling agency",
		}

		images, err := service.GetAllModelImages(name)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		gd := models.ModelGalleryData{
			BasePageData: base,
			Images:       images,
		}

		tmpl.ExecuteTemplate(w, "modelgallery", gd)
	}).Methods(http.MethodGet)

	r.HandleFunc("/create", func(w http.ResponseWriter, r *http.Request) {
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

	}).Methods(http.MethodGet)

	//r.HandleFunc("/random/")
	//r.HandleFunc("/create/")
	//r.HandleFunc("/create/test/")
	//r.HandleFunc("/create/gallery/")
	//r.HandleFunc("/images/{id}/delete/")
	//r.HandleFunc("/images/{id}/edit/")

	log.Println("Listening on " + *port)
	http.ListenAndServe(":"+*port, r)
}
