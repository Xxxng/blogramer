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
	export class Category {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new Category(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.name = source["name"];
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
	export class PostResponse {
	    id: number;
	    title: string;
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
	        this.platform = source["platform"];
	        this.status = source["status"];
	        this.published_at = source["published_at"];
	        this.post_url = source["post_url"];
	        this.error_message = source["error_message"];
	    }
	}
	export class Subject {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    category_id: number;
	    category: Category;
	    keyword: string;
	    is_used: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Subject(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.category_id = source["category_id"];
	        this.category = this.convertValues(source["category"], Category);
	        this.keyword = source["keyword"];
	        this.is_used = source["is_used"];
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

}

