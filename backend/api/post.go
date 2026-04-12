package api

import (
	"app/backend/database"
	"app/backend/models"
	"app/backend/platforms"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/generative-ai-go/genai"
	"github.com/liushuangls/go-anthropic/v2"
	"github.com/sashabaranov/go-openai"
	"google.golang.org/api/option"
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

	// 1. Get AI Settings
	var preferredAISetting models.Setting
	database.DB.Where("key = ?", "preferred_ai").First(&preferredAISetting)
	provider := preferredAISetting.Value
	if provider == "" {
		provider = "openai" // default
	}

	// 2. Generate Content using preferred AI
	content, err := generateContent(provider, subject, platform)
	if err != nil {
		return 0, err
	}

	// 3. Generate Image using OpenAI (DALL-E 3) - Always uses OpenAI for images
	var openAIKey models.Setting
	if err := database.DB.Where("key = ?", "openai_api_key").First(&openAIKey).Error; err == nil && openAIKey.Value != "" {
		client := openai.NewClient(openAIKey.Value)
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

func generateContent(provider string, subject models.Subject, platform models.Platform) (string, error) {
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

	switch provider {
	case "gemini":
		var apiKey models.Setting
		if err := database.DB.Where("key = ?", "gemini_api_key").First(&apiKey).Error; err != nil || apiKey.Value == "" {
			return "", errors.New("Gemini API Key not set")
		}
		ctx := context.Background()
		client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey.Value))
		if err != nil {
			return "", err
		}
		defer client.Close()
		model := client.GenerativeModel("gemini-1.5-flash")
		resp, err := model.GenerateContent(ctx, genai.Text(prompt))
		if err != nil {
			return "", err
		}
		if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
			return "", errors.New("gemini returned no content")
		}
		return fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0]), nil

	case "claude":
		var apiKey models.Setting
		if err := database.DB.Where("key = ?", "claude_api_key").First(&apiKey).Error; err != nil || apiKey.Value == "" {
			return "", errors.New("Claude API Key not set")
		}
		client := anthropic.NewClient(apiKey.Value)
		resp, err := client.CreateMessages(context.Background(), anthropic.MessagesRequest{
			Model: anthropic.ModelClaude3Dot5SonnetLatest,
			Messages: []anthropic.Message{
				{Role: anthropic.RoleUser, Content: []anthropic.MessageContent{anthropic.NewTextMessageContent(prompt)}},
			},
			MaxTokens: 4096,
		})
		if err != nil {
			return "", err
		}
		if len(resp.Content) == 0 || resp.Content[0].Text == nil {
			return "", errors.New("claude returned no content")
		}
		return *resp.Content[0].Text, nil

	default: // openai
		var apiKey models.Setting
		if err := database.DB.Where("key = ?", "openai_api_key").First(&apiKey).Error; err != nil || apiKey.Value == "" {
			return "", errors.New("OpenAI API Key not set")
		}
		client := openai.NewClient(apiKey.Value)
		resp, err := client.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			Messages: []openai.ChatCompletionMessage{{Role: openai.ChatMessageRoleUser, Content: prompt}},
		})
		if err != nil {
			return "", err
		}
		return resp.Choices[0].Message.Content, nil
	}
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
