package platforms

import (
	"app/backend/models"
	"errors"
)

type NaverPublisher struct{}

func (n *NaverPublisher) Publish(post models.Post, account models.Account) (string, error) {
	// Naver XML-RPC implementation needed
	return "", errors.New("Naver Blog implementation is coming soon")
}
