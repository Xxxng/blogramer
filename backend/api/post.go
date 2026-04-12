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
	
	// 1. Generate Content using GPT-4o
	prompt := fmt.Sprintf(`Write a detailed, SEO-optimized blog post about '%s' for a %s blog. 
Category: %s
Rules:
- Use markdown formatting.
- Include a catchy title at the beginning as # Title.
- Write at least 5 paragraphs with subheadings (##).
- Use a professional and engaging tone.
- The content should be valuable and informative.`, subject.Keyword, account.Platform, subject.Category.Name)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)

	if err != nil {
		return 0, fmt.Errorf("OpenAI GPT-4o error: %v", err)
	}

	content := resp.Choices[0].Message.Content

	// 2. Generate Image using DALL-E 3
	imagePrompt := fmt.Sprintf("A professional and high-quality blog header image about '%s'. Style: Modern, clean, and relevant to %s.", subject.Keyword, subject.Category.Name)
	imgResp, err := client.CreateImage(
		context.Background(),
		openai.ImageRequest{
			Prompt:         imagePrompt,
			Model:          openai.CreateImageModelDallE3,
			N:              1,
			Size:           openai.CreateImageSize1024x1024,
			ResponseFormat: openai.CreateImageResponseFormatURL,
		},
	)

	if err == nil && len(imgResp.Data) > 0 {
		imageURL := imgResp.Data[0].URL
		// Prepend image to content
		content = fmt.Sprintf("![Header Image](%s)\n\n%s", imageURL, content)
	}

	title := fmt.Sprintf("%s - %s", subject.Category.Name, subject.Keyword)

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

func GetPosts() ([]models.PostResponse, error) {
	var posts []models.Post
	if err := database.DB.Order("id desc").Find(&posts).Error; err != nil {
		return nil, err
	}
	return models.ToPostResponses(posts), nil
}

func GetPost(id uint) (models.PostResponse, error) {
	var post models.Post
	if err := database.DB.First(&post, id).Error; err != nil {
		return models.PostResponse{}, err
	}
	return models.ToPostResponse(post), nil
}

func UpdatePost(id uint, title string, content string) error {
	return database.DB.Model(&models.Post{}).Where("id = ?", id).Updates(map[string]interface{}{
		"title":   title,
		"content": content,
	}).Error
}

func DeletePost(id uint) error {
	return database.DB.Delete(&models.Post{}, id).Error
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
