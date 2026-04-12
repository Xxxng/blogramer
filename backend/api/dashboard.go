package api

import (
	"app/backend/database"
	"app/backend/models"
)

func GetDashboardStats() (models.DashboardStats, error) {
	var stats models.DashboardStats

	// Count active accounts
	database.DB.Model(&models.Account{}).Where("is_active = ?", true).Count(&stats.AccountCount)

	// Count published posts
	database.DB.Model(&models.Post{}).Where("status = ?", "published").Count(&stats.PublishedCount)

	// Count draft/pending posts
	database.DB.Model(&models.Post{}).Where("status = ?", "draft").Count(&stats.DraftCount)

	// Fetch 5 most recent posts
	var recentPosts []models.Post
	if err := database.DB.Order("id desc").Limit(5).Find(&recentPosts).Error; err != nil {
		return stats, err
	}
	stats.RecentPosts = models.ToPostResponses(recentPosts)

	return stats, nil
}
