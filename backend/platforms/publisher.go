package platforms

import "app/backend/models"

type Publisher interface {
	Publish(post models.Post, account models.Account) (string, error) // Returns Post URL or error
}

func GetPublisher(platform models.Platform) Publisher {
	switch platform {
	case models.Tistory:
		return &TistoryPublisher{}
	case models.WordPress:
		return &WordPressPublisher{}
	case models.Naver:
		return &NaverPublisher{}
	case models.Blogger:
		return &BloggerPublisher{}
	default:
		return nil
	}
}
