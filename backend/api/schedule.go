package api

import (
	"app/backend/database"
	"app/backend/models"
	"errors"
	"time"
)

func AddSchedule(postID uint, scheduledAtStr string) error {
	scheduledAt, err := time.Parse(time.RFC3339, scheduledAtStr)
	if err != nil {
		// Try alternative format if ISO8601 fails
		scheduledAt, err = time.Parse("2006-01-02T15:04", scheduledAtStr)
		if err != nil {
			return err
		}
	}

	// 1. Check if post exists
	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		return err
	}

	// 2. Check if already scheduled
	var existing models.Schedule
	if err := database.DB.Where("post_id = ? AND is_executed = ?", postID, false).First(&existing).Error; err == nil {
		// Update existing schedule
		existing.ScheduledAt = scheduledAt
		return database.DB.Save(&existing).Error
	}

	// 3. Create new schedule
	schedule := models.Schedule{
		PostID:      postID,
		ScheduledAt: scheduledAt,
		IsExecuted:  false,
	}

	if err := database.DB.Create(&schedule).Error; err != nil {
		return err
	}

	// 4. Update post status
	return database.DB.Model(&models.Post{}).Where("id = ?", postID).Update("status", "scheduled").Error
}

func GetSchedules() ([]models.ScheduleResponse, error) {
	var schedules []models.Schedule
	if err := database.DB.Preload("Post").Where("is_executed = ?", false).Order("scheduled_at asc").Find(&schedules).Error; err != nil {
		return nil, err
	}
	return models.ToScheduleResponses(schedules), nil
}

func CancelSchedule(scheduleID uint) error {
	var schedule models.Schedule
	if err := database.DB.First(&schedule, scheduleID).Error; err != nil {
		return err
	}

	// 1. Delete schedule
	if err := database.DB.Delete(&schedule).Error; err != nil {
		return err
	}

	// 2. Update post status back to draft
	return database.DB.Model(&models.Post{}).Where("id = ?", schedule.PostID).Update("status", "draft").Error
}

func GetScheduleByPostID(postID uint) (models.ScheduleResponse, error) {
	var schedule models.Schedule
	if err := database.DB.Preload("Post").Where("post_id = ? AND is_executed = ?", postID, false).First(&schedule).Error; err != nil {
		return models.ScheduleResponse{}, errors.New("schedule not found")
	}
	return models.ToScheduleResponse(schedule), nil
}
