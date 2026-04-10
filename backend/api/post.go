package api

import (
	"app/backend/database"
	"app/backend/models"
	"app/backend/platforms"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/sashabaranov/go-openai"
)

func GeneratePost(subjectID uint, accountID uint) (uint, error) {
	var subject models.Subject
	if err := database.DB.Preload("Category").First(&subject, subjectID).Error; err != nil {
		return 0, err
	}

	var account models.Account
	if err := database.DB.First(&account, accountID).Error; err != nil {
		return 0, err
	}

	// Get OpenAI API Key from Settings
	var apiKeySetting models.Setting
	if err := database.DB.Where("key = ?", "openai_api_key").First(&apiKeySetting).Error; err != nil {
		return 0, errors.New("OpenAI API Key not set")
	}

	client := openai.NewClient(apiKeySetting.Value)
	prompt := fmt.Sprintf("Write a detailed, SEO-optimized blog post about '%s' for a %s blog. Use markdown formatting. Category: %s", subject.Keyword, account.Platform, subject.Category.Name)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)

	if err != nil {
		return 0, fmt.Errorf("OpenAI API error: %v", err)
	}

	content := resp.Choices[0].Message.Content
	title := fmt.Sprintf("%s - %s", subject.Category.Name, subject.Keyword) // Simple title for now

	post := models.Post{
		Title:     title,
		Content:   content,
		Platform:  account.Platform,
		AccountID: account.ID,
		Status:    "draft",
	}

	if err := database.DB.Create(&post).Error; err != nil {
		return 0, err
	}

	// Mark subject as used
	subject.IsUsed = true
	database.DB.Save(&subject)

	return post.ID, nil
}

func PublishPost(postID uint) error {
	var post models.Post
	if err := database.DB.Preload("Account").First(&post, postID).Error; err != nil {
		return err
	}

	publisher := platforms.GetPublisher(post.Platform)
	if publisher == nil {
		return errors.New("unsupported platform")
	}

	url, err := publisher.Publish(post, post.Account)
	if err != nil {
		post.Status = "failed"
		post.ErrorMessage = err.Error()
		database.DB.Save(&post)
		return err
	}

	now := time.Now()
	post.Status = "published"
	post.PublishedAt = &now
	post.PostURL = url
	database.DB.Save(&post)

	return nil
}
