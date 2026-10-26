// Original IrikList literal rules, shared with the browser. No external matching service.
export const CITIES=['astana','almaty','shymkent'],LANGUAGES=['ru','kk','en'],TOPICS=['beauty','food','travel','education','tech','home','sport'];
export const LIMITS={profiles:80,profileVersions:400,briefs:40,briefVersions:200,publications:100,shortlists:200,keys:1200,bytes:1500000};
export function ensure(ok,status=400){if(!ok)throw Object.assign(new Error('Invalid command'),{status});}
export function keys(v,list){ensure(v&&typeof v==='object'&&!Array.isArray(v));ensure(JSON.stringify(Object.keys(v).sort())===JSON.stringify([...list].sort()));}
export function integer(v,min=1,max=Number.MAX_SAFE_INTEGER){ensure(Number.isSafeInteger(v)&&v>=min&&v<=max);return v;}
export function uuid(v){ensure(typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(v));return v;}
export function text(v,max,multiline=false){ensure(typeof v==='string'&&v.isWellFormed());v=v.trim();ensure(v.length>0&&v.length<=max&&! (multiline?/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/:/[\x00-\x1f\x7f]/).test(v));return v;}
function option(v,allowed,nullable=false){ensure((nullable&&v===null)||allowed.includes(v));return v;}
function list(v,allowed,min=0,max=allowed.length){ensure(Array.isArray(v)&&v.length>=min&&v.length<=max&&new Set(v).size===v.length);for(const x of v)option(x,allowed);return allowed.filter(x=>v.includes(x));}
export function normalizeProfile(v){keys(v,['city','languages','topics']);return {city:option(v.city,CITIES,true),languages:list(v.languages,LANGUAGES),topics:list(v.topics,TOPICS)};}
export function normalizeBrief(v){keys(v,['titleRu','titleKk','city','language','topics','topicsMode']);return {titleRu:text(v.titleRu,120),titleKk:text(v.titleKk,120),city:option(v.city,CITIES,true),language:option(v.language,LANGUAGES,true),topics:list(v.topics,TOPICS,1,3),topicsMode:option(v.topicsMode,['any','all'])};}
export function normalizeCode(v){ensure(typeof v==='string');v=v.trim();ensure(/^[sS][yY][nN]_[a-zA-Z0-9_]{1,24}$/.test(v));return v.toUpperCase();}
export function match(b,p){
 const reasons=[{field:'city',status:b.city===null?'ignored':p.city===null?'missing':p.city===b.city?'match':'mismatch',required:b.city,actual:p.city},
 {field:'language',status:b.language===null?'ignored':!p.languages.length?'missing':p.languages.includes(b.language)?'match':'mismatch',required:b.language,actual:[...p.languages]},
 {field:'topics',status:!p.topics.length?'missing':(b.topicsMode==='all'?b.topics.every(t=>p.topics.includes(t)):b.topics.some(t=>p.topics.includes(t)))?'match':'mismatch',required:{mode:b.topicsMode,values:[...b.topics]},actual:[...p.topics]}];
 return {eligible:reasons.every(r=>['ignored','match'].includes(r.status)),reasons};
}
