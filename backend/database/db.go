package database

import (
	"app/backend/models"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("blogramer.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto Migration
	err = DB.AutoMigrate(&models.Account{}, &models.Post{}, &models.Category{}, &models.Subject{}, &models.Schedule{}, &models.Setting{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
}
