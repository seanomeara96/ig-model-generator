package main

import (
	"database/sql"
	"flag"
	"fmt"
	"ig-model-generator/services"
	"log"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

func main() {

	godotenv.Load()

	name := flag.String("name", "", "model name (lowercase & hyphenated)")

	description := flag.String("description", "", "model description")

	flag.Parse()

	if *name == "" || *description == "" {
		fmt.Println("Need to supply -name and -description")
		return
	}

	db, err := sql.Open("sqlite3", "main.db")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	service := services.NewService(db)

	if err := service.SaveModel(*name, *description); err != nil {
		log.Fatal(err)
	}

	if err := service.CreateGallery(*name, *description); err != nil {
		log.Fatal(err)
	}

}
