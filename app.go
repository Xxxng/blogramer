package main

import (
	"app/backend/api"
	"app/backend/models"
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Account APIs
func (a *App) AddAccount(account models.Account) (uint, error) {
	return api.AddAccount(account)
}

func (a *App) GetAccounts() ([]models.Account, error) {
	return api.GetAccounts()
}

func (a *App) DeleteAccount(id uint) error {
	return api.DeleteAccount(id)
}

// Post APIs
func (a *App) GeneratePost(subjectID uint, accountID uint) (uint, error) {
	return api.GeneratePost(subjectID, accountID)
}

func (a *App) PublishPost(postID uint) error {
	return api.PublishPost(postID)
}

// Subject & Category APIs
func (a *App) AddCategory(name string) (uint, error) {
	return api.AddCategory(name)
}

func (a *App) GetCategories() ([]models.Category, error) {
	return api.GetCategories()
}

func (a *App) AddSubject(categoryID uint, keyword string) (uint, error) {
	return api.AddSubject(categoryID, keyword)
}

func (a *App) GetSubjects(categoryID uint) ([]models.Subject, error) {
	return api.GetSubjects(categoryID)
}

// Setting APIs
func (a *App) SetSetting(key string, value string) error {
	return api.SetSetting(key, value)
}

func (a *App) GetSetting(key string) (string, error) {
	return api.GetSetting(key)
}
