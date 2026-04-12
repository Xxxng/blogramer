package api

import (
	"app/backend/database"
	"app/backend/models"
)

func AddCategory(name string) (uint, error) {
	category := models.Category{Name: name}
	if err := database.DB.Create(&category).Error; err != nil {
		return 0, err
	}
	return category.ID, nil
}

func GetCategories() ([]models.CategoryResponse, error) {
	var categories []models.Category
	if err := database.DB.Find(&categories).Error; err != nil {
		return nil, err
	}
	return models.ToCategoryResponses(categories), nil
}

func AddSubject(categoryID uint, keyword string) (uint, error) {
	subject := models.Subject{
		CategoryID: categoryID,
		Keyword:    keyword,
	}
	if err := database.DB.Create(&subject).Error; err != nil {
		return 0, err
	}
	return subject.ID, nil
}

func GetSubjects(categoryID uint) ([]models.SubjectResponse, error) {
	var subjects []models.Subject
	if err := database.DB.Where("category_id = ?", categoryID).Find(&subjects).Error; err != nil {
		return nil, err
	}
	return models.ToSubjectResponses(subjects), nil
}
