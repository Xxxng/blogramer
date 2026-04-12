package api

import (
	"app/backend/database"
	"app/backend/models"
)

func AddAccount(req models.AccountRequest) (uint, error) {
	account := req.ToAccount()
	if err := database.DB.Create(&account).Error; err != nil {
		return 0, err
	}
	return account.ID, nil
}

func GetAccounts() ([]models.AccountResponse, error) {
	var accounts []models.Account
	if err := database.DB.Find(&accounts).Error; err != nil {
		return nil, err
	}
	return models.ToAccountResponses(accounts), nil
}

func DeleteAccount(id uint) error {
	return database.DB.Delete(&models.Account{}, id).Error
}
