package main

import (
	"database/sql"
	"flag"
	"fmt"
	"ig-model-generator/services"
	"log"
)

func main() {

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

	if err := service.CreateGallery(*name, *description); err != nil {
		log.Fatal(err)
	}

}
