package platforms

import (
	"app/backend/models"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type BloggerPublisher struct{}

func (b *BloggerPublisher) Publish(post models.Post, account models.Account) (string, error) {
	// site_url should be the Blogger Blog ID
	// access_token should be the OAuth2 Access Token
	apiURL := fmt.Sprintf("https://www.googleapis.com/blogger/v3/blogs/%s/posts/", account.SiteURL)

	postData := map[string]interface{}{
		"title":   post.Title,
		"content": post.Content,
		"blog": map[string]string{
			"id": account.SiteURL,
		},
	}

	jsonData, err := json.Marshal(postData)
	if err != nil {
		return "", fmt.Errorf("failed to marshal blogger post data: %v", err)
	}

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create blogger request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+account.AccessToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to call blogger API: %v", err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("blogger API error (status %d): %s", resp.StatusCode, string(body))
	}

	var result struct {
		URL string `json:"url"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("failed to parse blogger response: %v", err)
	}

	return result.URL, nil
}
