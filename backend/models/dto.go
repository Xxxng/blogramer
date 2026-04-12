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

// ToResponse converts Account model to AccountResponse DTO
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
