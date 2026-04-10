package platforms

import (
	"app/backend/models"
	"errors"
)

type BloggerPublisher struct{}

func (b *BloggerPublisher) Publish(post models.Post, account models.Account) (string, error) {
	// Google Blogger API v3 implementation needed (OAuth2)
	return "", errors.New("Blogger implementation is coming soon")
}
