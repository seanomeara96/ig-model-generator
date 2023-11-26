package models

type Image struct {
	ID     int
	URL    string
	Prompt string
	Name   string
}

type Prompt struct {
	ID       int
	Scenario string
	Prompt   string
}

type CommonPageData struct {
	SiteTitle  string
	Env        string
	StyleSheet string
	Names      []string
}

type BasePageData struct {
	CommonPageData
	PageTitle       string
	MetaDescription string
}

type HomePageData struct {
	BasePageData
	Collections [][]Image
}

type ModelGalleryData struct {
	BasePageData
	Images []Image
}

type PromptListPageData struct {
	BasePageData
	Scenarios []string
	Prompts   []Prompt
}

type ModelCreationPageData struct {
	BasePageData
	SamplePrompt string
}
