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

	var platform models.Platform = "Generic"

	if accountID > 0 {
		var account models.Account
		if err := database.DB.First(&account, accountID).Error; err == nil {
			platform = account.Platform
		}
	}

	// Get OpenAI API Key from Settings
	var apiKeySetting models.Setting
	if err := database.DB.Where("key = ?", "openai_api_key").First(&apiKeySetting).Error; err != nil {
		return 0, errors.New("OpenAI API Key not set in Settings")
	}

	client := openai.NewClient(apiKeySetting.Value)
	
	// 1. Content Prompt (Refined for quality)
	prompt := fmt.Sprintf(`너는 전문 블로그 포스팅 작가야. 아래 정보를 바탕으로 SEO에 최적화된 고품질 블로그 글을 작성해줘.

주제: %s
카테고리: %s
대상 플랫폼: %s

작성 규칙:
- 반드시 한국어로 작성해줘.
- 마크다운(Markdown) 형식을 사용해.
- 제목은 맨 처음에 '# 제목' 형태로 작성해.
- 독자의 관심을 끌 수 있는 서론, 3개 이상의 본문 소주제(##), 그리고 결론으로 구성해.
- 문체는 친절하고 전문적인 느낌이 나도록 작성해.
- 글자수는 공백 포함 1500자 내외로 풍부하게 작성해.
- 독자에게 실질적인 정보와 가치를 제공하는 내용이어야 해.`, subject.Keyword, subject.Category.Name, platform)

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

	// 2. Image Generation
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
		content = fmt.Sprintf("![Header Image](%s)\n\n%s", imageURL, content)
	}

	title := fmt.Sprintf("%s - %s", subject.Category.Name, subject.Keyword)

	post := models.Post{
		Title:     title,
		Content:   content,
		Platform:  platform,
		AccountID: accountID,
		Status:    "draft",
	}

	if err := database.DB.Create(&post).Error; err != nil {
		return 0, err
	}

	subject.IsUsed = true
	database.DB.Save(&subject)

	return post.ID, nil
}

func GeneratePostWithKeyword(keyword string, accountID uint) (uint, error) {
	// 1. Ensure "Uncategorized" category exists
	var category models.Category
	if err := database.DB.Where("name = ?", "Uncategorized").First(&category).Error; err != nil {
		category = models.Category{Name: "Uncategorized"}
		database.DB.Create(&category)
	}

	// 2. Create a new Subject for this keyword
	subject := models.Subject{
		CategoryID: category.ID,
		Keyword:    keyword,
	}
	if err := database.DB.Create(&subject).Error; err != nil {
		return 0, err
	}

	// 3. Call existing GeneratePost logic
	return GeneratePost(subject.ID, accountID)
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
