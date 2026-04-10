package api

import (
	"app/backend/database"
	"app/backend/models"
)

func SetSetting(key string, value string) error {
	setting := models.Setting{Key: key, Value: value}
	return database.DB.Save(&setting).Error
}

func GetSetting(key string) (string, error) {
	var setting models.Setting
	if err := database.DB.First(&setting, "key = ?", key).Error; err != nil {
		return "", err
	}
	return setting.Value, nil
}
