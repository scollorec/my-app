export type Freshness='recent'|'ageing'|'old'|'unavailable';
export interface Establishment { id:number; name:string; businessType:string; address:string; rating:string|undefined; ratingDate:string|undefined; latitude:number|undefined; longitude:number|undefined; localAuthority:string; schemeType:string; scores?:{hygiene?:number; structural?:number; confidence?:number}; distance?:number; retrievedAt:string }
export interface SearchLocation { postcode:string; latitude:number; longitude:number }
export interface SearchFilters { radius:number; rating:string; businessType:string; age:Freshness|'all'; sort:'distance'|'rating'|'date'|'name' }
