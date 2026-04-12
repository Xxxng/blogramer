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
	    scheduled_at?: string;
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
	        this.scheduled_at = source["scheduled_at"];
	        this.post_url = source["post_url"];
	        this.error_message = source["error_message"];
	    }
	}
	export class DashboardStats {
	    account_count: number;
	    published_count: number;
	    draft_count: number;
	    recent_posts: PostResponse[];
	
	    static createFrom(source: any = {}) {
	        return new DashboardStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.account_count = source["account_count"];
	        this.published_count = source["published_count"];
	        this.draft_count = source["draft_count"];
	        this.recent_posts = this.convertValues(source["recent_posts"], PostResponse);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ScheduleResponse {
	    id: number;
	    post_id: number;
	    post_title: string;
	    scheduled_at: string;
	    is_executed: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ScheduleResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.post_id = source["post_id"];
	        this.post_title = source["post_title"];
	        this.scheduled_at = source["scheduled_at"];
	        this.is_executed = source["is_executed"];
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

