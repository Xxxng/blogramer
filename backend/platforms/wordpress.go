package platforms

import (
	"app/backend/models"
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type WordPressPublisher struct{}

func (w *WordPressPublisher) Publish(post models.Post, account models.Account) (string, error) {
	apiURL := fmt.Sprintf("%s/wp-json/wp/v2/posts", account.SiteURL)

	postData := map[string]interface{}{
		"title":   post.Title,
		"content": post.Content,
		"status":  "publish",
	}

	jsonData, err := json.Marshal(postData)
	if err != nil {
		return "", fmt.Errorf("failed to marshal post data: %v", err)
	}

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create WordPress request: %v", err)
	}

	// Basic Auth using Application Password
	auth := fmt.Sprintf("%s:%s", account.AccountName, account.AppPassword)
	encodedAuth := base64.StdEncoding.EncodeToString([]byte(auth))
	req.Header.Set("Authorization", "Basic "+encodedAuth)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to call WordPress API: %v", err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("WordPress API error (status %d): %s", resp.StatusCode, string(body))
	}

	var result struct {
		Link string `json:"link"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("failed to parse WordPress response: %v", err)
	}

	return result.Link, nil
}
