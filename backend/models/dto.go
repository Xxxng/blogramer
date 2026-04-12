package models

// AccountRequest represents the data needed to create or update an account
type AccountRequest struct {
	Platform    Platform `json:"platform"`
	AccountName string   `json:"account_name"`
	SiteURL     string   `json:"site_url"`
	AccessToken string   `json:"access_token"`
	AppPassword string   `json:"app_password"`
}

// AccountResponse represents the account data sent to the frontend
type AccountResponse struct {
	ID          uint     `json:"id"`
	Platform    Platform `json:"platform"`
	AccountName string   `json:"account_name"`
	SiteURL     string   `json:"site_url"`
	IsActive    bool     `json:"is_active"`
}

// ToAccount converts AccountRequest to Account model
func (r *AccountRequest) ToAccount() Account {
	return Account{
		Platform:    r.Platform,
		AccountName: r.AccountName,
		SiteURL:     r.SiteURL,
		AccessToken: r.AccessToken,
		AppPassword: r.AppPassword,
		IsActive:    true,
	}
}

// ToAccountResponse converts Account model to AccountResponse DTO
func ToAccountResponse(a Account) AccountResponse {
	return AccountResponse{
		ID:          a.ID,
		Platform:    a.Platform,
		AccountName: a.AccountName,
		SiteURL:     a.SiteURL,
		IsActive:    a.IsActive,
	}
}

// ToAccountResponses converts a slice of Account models to AccountResponse DTOs
func ToAccountResponses(accounts []Account) []AccountResponse {
	responses := make([]AccountResponse, len(accounts))
	for i, a := range accounts {
		responses[i] = ToAccountResponse(a)
	}
	return responses
}

// PostResponse represents the post data sent to the frontend
type PostResponse struct {
	ID           uint      `json:"id"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	Platform     Platform  `json:"platform"`
	Status       string    `json:"status"`
	PublishedAt  *string   `json:"published_at"`
	PostURL      string    `json:"post_url"`
	ErrorMessage string    `json:"error_message"`
}

// ToPostResponse converts Post model to PostResponse DTO
func ToPostResponse(p Post) PostResponse {
	var publishedAt *string
	if p.PublishedAt != nil {
		s := p.PublishedAt.Format("2006-01-02 15:04")
		publishedAt = &s
	}
	return PostResponse{
		ID:           p.ID,
		Title:        p.Title,
		Content:      p.Content,
		Platform:     p.Platform,
		Status:       p.Status,
		PublishedAt:  publishedAt,
		PostURL:      p.PostURL,
		ErrorMessage: p.ErrorMessage,
	}
}

// ToPostResponses converts a slice of Post models to PostResponse DTOs
func ToPostResponses(posts []Post) []PostResponse {
	responses := make([]PostResponse, len(posts))
	for i, p := range posts {
		responses[i] = ToPostResponse(p)
	}
	return responses
}

// CategoryResponse represents the category data sent to the frontend
type CategoryResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// SubjectResponse represents the subject data sent to the frontend
type SubjectResponse struct {
	ID         uint   `json:"id"`
	CategoryID uint   `json:"category_id"`
	Keyword    string `json:"keyword"`
	IsUsed     bool   `json:"is_used"`
}

// ToCategoryResponse converts Category model to CategoryResponse DTO
func ToCategoryResponse(c Category) CategoryResponse {
	return CategoryResponse{
		ID:   c.ID,
		Name: c.Name,
	}
}

// ToCategoryResponses converts a slice of Category models to CategoryResponse DTOs
func ToCategoryResponses(categories []Category) []CategoryResponse {
	responses := make([]CategoryResponse, len(categories))
	for i, c := range categories {
		responses[i] = ToCategoryResponse(c)
	}
	return responses
}

// ToSubjectResponse converts Subject model to SubjectResponse DTO
func ToSubjectResponse(s Subject) SubjectResponse {
	return SubjectResponse{
		ID:         s.ID,
		CategoryID: s.CategoryID,
		Keyword:    s.Keyword,
		IsUsed:     s.IsUsed,
	}
}

// ToSubjectResponses converts a slice of Subject models to SubjectResponse DTOs
func ToSubjectResponses(subjects []Subject) []SubjectResponse {
	responses := make([]SubjectResponse, len(subjects))
	for i, s := range subjects {
		responses[i] = ToSubjectResponse(s)
	}
	return responses
}
