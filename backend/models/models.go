package models

import (
	"time"

	"gorm.io/gorm"
)

// Platform enum
type Platform string

const (
	Tistory   Platform = "Tistory"
	WordPress Platform = "WordPress"
	Naver     Platform = "Naver"
	Blogger   Platform = "Blogger"
)

// Account represents a blog account for a specific platform
type Account struct {
	gorm.Model
	Platform    Platform `json:"platform"`
	AccountName string   `json:"account_name"` // Alias for the account
	SiteURL     string   `json:"site_url"`     // WordPress URL, Tistory Blog Name etc.
	AccessToken string   `json:"access_token"` // API Key or Access Token
	AppPassword string   `json:"app_password"` // For WordPress etc.
	IsActive    bool     `json:"is_active" gorm:"default:true"`
}

// Post represents a blog post (draft or published)
type Post struct {
	gorm.Model
	Title       string     `json:"title"`
	Content     string     `json:"content"`
	Tags        string     `json:"tags"` // Comma-separated tags
	Platform    Platform   `json:"platform"`
	AccountID   uint       `json:"account_id"`
	Account     Account    `json:"account" gorm:"foreignKey:AccountID"`
	Status      string     `json:"status"` // "draft", "scheduled", "published", "failed"
	PublishedAt *time.Time `json:"published_at"`
	PostURL     string     `json:"post_url"`
	ErrorMessage string    `json:"error_message"`
}

// Category represents a grouping for subjects
type Category struct {
	gorm.Model
	Name string `json:"name"`
}

// Subject represents a topic or keyword to generate posts from
type Subject struct {
	gorm.Model
	CategoryID uint     `json:"category_id"`
	Category   Category `json:"category" gorm:"foreignKey:CategoryID"`
	Keyword    string   `json:"keyword"`
	IsUsed     bool     `json:"is_used" gorm:"default:false"`
}

// Schedule represents a reservation for posting
type Schedule struct {
	gorm.Model
	PostID      uint      `json:"post_id"`
	Post        Post      `json:"post" gorm:"foreignKey:PostID"`
	ScheduledAt time.Time `json:"scheduled_at"`
	IsExecuted  bool      `json:"is_executed" gorm:"default:false"`
}

// Setting represents application configuration
type Setting struct {
	Key   string `json:"key" gorm:"primaryKey"`
	Value string `json:"value"`
}
