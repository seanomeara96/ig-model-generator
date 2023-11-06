package main

import (
	"flag"
	"fmt"
)

func main() {

	name := flag.String("name", "", "model name (lowercase & hyphenated)")

	description := flag.String("description", "", "model description")

	flag.Parse()

	if *name == "" || *description == "" {
		fmt.Println("Need to supply -name and -description")
		return
	}

	/*
	   db, err := sql.Open("sqlite3", "main.db")

	   	if err != nil {
	   		panic(err)
	   	}

	   defer db.Close()

	   service := services.NewService(db)

	   err := service.CreateGallery(name, description)

	   	if err != nil {
	   		log.Error(err)
	   	}
	*/
}
