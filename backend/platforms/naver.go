package platforms

import (
	"app/backend/models"
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
)

type NaverPublisher struct{}

func (n *NaverPublisher) Publish(post models.Post, account models.Account) (string, error) {
	// Naver uses MetaWeblog API (XML-RPC)
	// site_url should be the Naver Blog ID
	// access_token should be the API ID (usually same as Blog ID)
	// app_password should be the API Key (issued from Naver Blog settings)

	apiURL := "https://api.blog.naver.com/xmlrpc"
	
	xmlReq := fmt.Sprintf(`<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.newPost</methodName>
  <params>
    <param><value><string>%s</string></value></param>
    <param><value><string>%s</string></value></param>
    <param><value><string>%s</string></value></param>
    <param>
      <value>
        <struct>
          <member><name>title</name><value><string>%s</string></value></member>
          <member><name>description</name><value><string>%s</string></value></member>
          <member><name>tags</name><value><string>%s</string></value></member>
        </struct>
      </value>
    </param>
    <param><value><boolean>1</boolean></value></param>
  </params>
</methodCall>`, account.SiteURL, account.AccountName, account.AppPassword, post.Title, post.Content, post.Tags)

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer([]byte(xmlReq)))
	if err != nil {
		return "", fmt.Errorf("failed to create Naver request: %v", err)
	}
	req.Header.Set("Content-Type", "text/xml")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to call Naver API: %v", err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Naver API error (status %d): %s", resp.StatusCode, string(body))
	}

	// Naver returns an XML response with the post ID
	// For simplicity, we return the blog URL as the result
	blogURL := fmt.Sprintf("https://blog.naver.com/%s", account.SiteURL)
	return blogURL, nil
}
