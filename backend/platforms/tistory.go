package platforms

import (
	"app/backend/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)

type TistoryPublisher struct{}

func (t *TistoryPublisher) Publish(post models.Post, account models.Account) (string, error) {
	apiURL := "https://www.tistory.com/apis/post/write"

	data := url.Values{}
	data.Set("access_token", account.AccessToken)
	data.Set("output", "json")
	data.Set("blogName", account.SiteURL)
	data.Set("title", post.Title)
	data.Set("content", post.Content)
	data.Set("visibility", "3") // 0: private, 3: public
	data.Set("tag", post.Tags)

	resp, err := http.PostForm(apiURL, data)
	if err != nil {
		return "", fmt.Errorf("failed to call Tistory API: %v", err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Tistory API error (status %d): %s", resp.StatusCode, string(body))
	}

	var result struct {
		Tistory struct {
			Status  string `json:"status"`
			URL     string `json:"url"`
			PostID  string `json:"postId"`
			Message string `json:"message"`
		} `json:"tistory"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("failed to parse Tistory response: %v", err)
	}

	if result.Tistory.Status != "200" {
		return "", fmt.Errorf("Tistory API error: %s", result.Tistory.Message)
	}

	return result.Tistory.URL, nil
}
