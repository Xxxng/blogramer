package api

import (
	"app/backend/database"
	"app/backend/models"
	"context"
	"log"
	"time"
)

func StartScheduler(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	log.Println("Scheduler worker started...")

	for {
		select {
		case <-ctx.Done():
			log.Println("Scheduler worker stopping...")
			return
		case <-ticker.C:
			processSchedules()
		}
	}
}

func processSchedules() {
	var schedules []models.Schedule
	// Fetch all non-executed schedules
	if err := database.DB.Where("is_executed = ?", false).Find(&schedules).Error; err != nil {
		log.Printf("Scheduler: Failed to fetch schedules: %v\n", err)
		return
	}

	now := time.Now()

	for _, schedule := range schedules {
		// 1. If it's time to publish (within 5 minutes of now)
		if now.After(schedule.ScheduledAt) && now.Sub(schedule.ScheduledAt) <= 5*time.Minute {
			log.Printf("Scheduler: Executing schedule for post %d\n", schedule.PostID)
			err := PublishPost(schedule.PostID)
			if err != nil {
				log.Printf("Scheduler: Failed to publish post %d: %v\n", schedule.PostID, err)
				// Update schedule with error? PRD says failed to failed, but scheduler missed logic is different.
				// If it fails, we keep it as not executed but maybe mark it failed? 
				// For now, let's mark it executed so we don't loop forever on a bad post.
				schedule.IsExecuted = true
				database.DB.Save(&schedule)
			} else {
				schedule.IsExecuted = true
				database.DB.Save(&schedule)
				log.Printf("Scheduler: Successfully published post %d\n", schedule.PostID)
			}
		} else if now.After(schedule.ScheduledAt) && now.Sub(schedule.ScheduledAt) > 5*time.Minute {
			// 2. Offline Postpone: Missed by more than 5 minutes (App was closed)
			// Postpone +24h until it's in the future
			originalTime := schedule.ScheduledAt
			for now.After(schedule.ScheduledAt) {
				schedule.ScheduledAt = schedule.ScheduledAt.Add(24 * time.Hour)
			}
			database.DB.Save(&schedule)
			log.Printf("Scheduler: Missed schedule for post %d (original: %v). Postponed to %v\n", 
				schedule.PostID, originalTime.Format(time.RFC3339), schedule.ScheduledAt.Format(time.RFC3339))
		}
	}
}
