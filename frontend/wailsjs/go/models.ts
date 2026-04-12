export namespace models {
	
	export class AccountRequest {
	    platform: string;
	    account_name: string;
	    site_url: string;
	    access_token: string;
	    app_password: string;
	
	    static createFrom(source: any = {}) {
	        return new AccountRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.platform = source["platform"];
	        this.account_name = source["account_name"];
	        this.site_url = source["site_url"];
	        this.access_token = source["access_token"];
	        this.app_password = source["app_password"];
	    }
	}
	export class AccountResponse {
	    id: number;
	    platform: string;
	    account_name: string;
	    site_url: string;
	    is_active: boolean;
	
	    static createFrom(source: any = {}) {
	        return new AccountResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.platform = source["platform"];
	        this.account_name = source["account_name"];
	        this.site_url = source["site_url"];
	        this.is_active = source["is_active"];
	    }
	}
	export class CategoryResponse {
	    id: number;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new CategoryResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	    }
	}
	export class PostResponse {
	    id: number;
	    title: string;
	    content: string;
	    platform: string;
	    status: string;
	    published_at?: string;
	    post_url: string;
	    error_message: string;
	
	    static createFrom(source: any = {}) {
	        return new PostResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.content = source["content"];
	        this.platform = source["platform"];
	        this.status = source["status"];
	        this.published_at = source["published_at"];
	        this.post_url = source["post_url"];
	        this.error_message = source["error_message"];
	    }
	}
	export class SubjectResponse {
	    id: number;
	    category_id: number;
	    keyword: string;
	    is_used: boolean;
	
	    static createFrom(source: any = {}) {
	        return new SubjectResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.category_id = source["category_id"];
	        this.keyword = source["keyword"];
	        this.is_used = source["is_used"];
	    }
	}

}

