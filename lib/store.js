// Original IrikList domain/event rules on owner-authored five-table SQLite infrastructure.
import {DatabaseSync,backup as sqliteBackup} from 'node:sqlite';import {isDeepStrictEqual as equal} from 'node:util';import {mkdirSync} from 'node:fs';import {dirname} from 'node:path';
import {ensure,keys,integer,uuid,text,normalizeCode,normalizeProfile,normalizeBrief,match,LIMITS} from '../public/domain.js';
const empty=()=>({profiles:[],briefs:[],publications:[],shortlists:[],keys:[]});
const copy=structuredClone;
const fields={profileCreate:['code','content'],profileEdit:['id','expectedVersion','content'],profileArchive:['id'],briefCreate:['content'],briefEdit:['id','expectedVersion','content'],briefArchive:['id'],publish:['id','expectedVersion'],publicationArchive:['id'],shortlistCreate:['publicationId','entries'],shortlistArchive:['id']};
const operators=new Set(['shortlistCreate','shortlistArchive']);
function role(actor,roleFor,action){ensure(actor&&typeof actor.name==='string'&&roleFor(actor.name)===actor.role,403);ensure(actor.role===(operators.has(action)?'operator':'admin'),403);}
function normalized(action,p){
 ensure(Object.hasOwn(fields,action));keys(p,fields[action]);const out={};
 if('id'in p)out.id=uuid(p.id);if('expectedVersion'in p)out.expectedVersion=integer(p.expectedVersion);
 if(action==='profileCreate')out.code=normalizeCode(p.code);
 if(action.startsWith('profile')&&'content'in p)out.content=normalizeProfile(p.content);
 if(action.startsWith('brief')&&'content'in p)out.content=normalizeBrief(p.content);
 if(action==='shortlistCreate'){
  out.publicationId=uuid(p.publicationId);ensure(Array.isArray(p.entries)&&p.entries.length>=1&&p.entries.length<=5);const seen=new Set();
  out.entries=p.entries.map(e=>{keys(e,['profileId','version','reason']);uuid(e.profileId);ensure(!seen.has(e.profileId));seen.add(e.profileId);return {profileId:e.profileId,version:integer(e.version),reason:text(e.reason,500,true)};});
 }
 return out;
}
function find(rows,id){const r=rows.find(x=>x.id===id);ensure(r,404);return r;}
function active(row){ensure(row.archivedAt===null,409);return row;}
function publication(data,id){const p=active(find(data.publications,id));active(find(data.briefs,p.briefId));return p;}
function apply(data,action,p,actor,key,at){
 const version=(number,content)=>({version:number,content:copy(content),at,actor:actor.name,key});
 if(action==='profileCreate'||action==='briefCreate'){
  const profiles=action==='profileCreate',rows=profiles?data.profiles:data.briefs;
  if(profiles)ensure(!rows.some(r=>r.code===p.code),409);
  rows.push({id:key,...(profiles?{code:p.code}:{}),versions:[version(1,p.content)],createdAt:at,createdBy:actor.name,archivedAt:null,archiveKey:null});
 }else if(action==='profileEdit'||action==='briefEdit'){
  const r=active(find(action==='profileEdit'?data.profiles:data.briefs,p.id));ensure(r.versions.at(-1).version===p.expectedVersion,409);r.versions.push(version(p.expectedVersion+1,p.content));
 }else if(['profileArchive','briefArchive','publicationArchive','shortlistArchive'].includes(action)){
  const rows=action==='profileArchive'?data.profiles:action==='briefArchive'?data.briefs:action==='publicationArchive'?data.publications:data.shortlists,r=find(rows,p.id);
  if(action==='shortlistArchive')ensure(r.owner===actor.name,403);active(r);r.archivedAt=at;r.archiveKey=key;
 }else if(action==='publish'){
  const b=active(find(data.briefs,p.id)),v=b.versions.at(-1);ensure(v.version===p.expectedVersion,409);ensure(!data.publications.some(r=>r.briefId===p.id&&r.briefVersion===v.version),409);
  data.publications.push({id:key,briefId:b.id,briefVersion:v.version,content:copy(v.content),createdAt:at,createdBy:actor.name,archivedAt:null,archiveKey:null});
 }else if(action==='shortlistCreate'){
  const pub=publication(data,p.publicationId);ensure(!data.shortlists.some(r=>r.publicationId===pub.id&&r.owner===actor.name),409);
  const entries=p.entries.map(e=>{const profile=active(find(data.profiles,e.profileId)),v=profile.versions.at(-1);ensure(v.version===e.version,409);const result=match(pub.content,v.content);ensure(result.eligible,409);return {...e,profile:{code:profile.code,content:copy(v.content)},reasons:result.reasons};}).sort((a,b)=>a.profile.code<b.profile.code?-1:1);
  data.shortlists.push({id:key,publicationId:pub.id,publication:copy(pub),entries,owner:actor.name,createdAt:at,archivedAt:null,archiveKey:null});
 }else ensure(false);
}
function capacity(d){
 ensure(d.profiles.length<=LIMITS.profiles&&d.profiles.reduce((n,r)=>n+r.versions.length,0)<=LIMITS.profileVersions&&d.briefs.length<=LIMITS.briefs&&d.briefs.reduce((n,r)=>n+r.versions.length,0)<=LIMITS.briefVersions&&d.publications.length<=LIMITS.publications&&d.shortlists.length<=LIMITS.shortlists&&d.keys.length<=LIMITS.keys,409);
 ensure(Buffer.byteLength(JSON.stringify(d),'utf8')<=LIMITS.bytes,409);
}
function timestamp(v){const n=typeof v==='string'?Date.parse(v):NaN;ensure(Number.isSafeInteger(n)&&n>=0&&new Date(n).toISOString()===v);return n;}
function replay(data,roleFor,now){
 keys(data,['profiles','briefs','publications','shortlists','keys']);for(const k of Object.keys(data))ensure(Array.isArray(data[k]));capacity(data);
 const rebuilt=empty(),seen=new Set();let previous=-1;
 for(const event of data.keys){
  keys(event,['key','at','actor','action','payload']);uuid(event.key);ensure(!seen.has(event.key));seen.add(event.key);const epoch=timestamp(event.at);ensure(epoch>=previous&&epoch<=timestamp(now));previous=epoch;
  const actor={name:event.actor,role:roleFor(event.actor)};
  if(event.action==='restore'){keys(event.payload,[]);ensure(actor.role==='admin');}
  else{role(actor,roleFor,event.action);const p=normalized(event.action,event.payload);ensure(equal(p,event.payload));apply(rebuilt,event.action,p,actor,event.key,event.at);}
  rebuilt.keys.push(copy(event));capacity(rebuilt);
 }
 ensure(equal(rebuilt,data));
}
export class IrikStore {
 constructor(path=':memory:',{now=()=>Date.now()}={}){
  this.now=now;if(path!==':memory:')mkdirSync(dirname(path),{recursive:true,mode:0o700});this.db=new DatabaseSync(path);
  const id=0x4952494b,current=this.db.prepare('PRAGMA application_id').get().application_id,version=this.db.prepare('PRAGMA user_version').get().user_version,count=this.db.prepare("SELECT count(*) n FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'").get().n;
  if(!(current===0&&version===0&&count===0)&&!(current===id&&version===1)){this.db.close();ensure(false);}
  this.db.exec(`PRAGMA busy_timeout=5000;PRAGMA journal_mode=WAL;CREATE TABLE IF NOT EXISTS workspace(id INTEGER PRIMARY KEY CHECK(id=1),revision INTEGER NOT NULL,payload TEXT NOT NULL);CREATE TABLE IF NOT EXISTS audit(seq INTEGER PRIMARY KEY AUTOINCREMENT,requestKey TEXT UNIQUE NOT NULL,at TEXT NOT NULL,actor TEXT NOT NULL,action TEXT NOT NULL);CREATE TABLE IF NOT EXISTS users(name TEXT PRIMARY KEY,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','operator')));CREATE TABLE IF NOT EXISTS sessions(digest TEXT PRIMARY KEY,username TEXT NOT NULL,csrf TEXT NOT NULL,expires INTEGER NOT NULL);CREATE TABLE IF NOT EXISTS failures(name TEXT PRIMARY KEY,count INTEGER NOT NULL,since INTEGER NOT NULL);PRAGMA application_id=${id};PRAGMA user_version=1;`);
  this.db.prepare('INSERT OR IGNORE INTO workspace VALUES(1,0,?)').run(JSON.stringify(empty()));
 }
 close(){if(this.db?.isOpen)this.db.close();}
 snapshot(){const r=this.db.prepare('SELECT revision,payload FROM workspace WHERE id=1').get();return {revision:r.revision,data:JSON.parse(r.payload)};}
 roleFor(name){return typeof name==='string'?this.db.prepare('SELECT role FROM users WHERE name=?').get(name)?.role:undefined;}
 actor(a,admin=false){ensure(a&&['admin','operator'].includes(a.role)&&this.roleFor(a.name)===a.role,403);if(admin)ensure(a.role==='admin',403);}
 safeState(actor){this.actor(actor);const s=this.snapshot();delete s.data.keys;return s;}
 time(){const n=this.now();ensure(Number.isSafeInteger(n)&&n>=0&&Number.isFinite(new Date(n).getTime()),409);return new Date(n).toISOString();}
 fresh(d,key,at){uuid(key);ensure(!d.keys.some(e=>e.key===key),409);ensure(!d.keys.length||timestamp(at)>=timestamp(d.keys.at(-1).at),409);}
 transact(actor,fn){
  this.db.exec('BEGIN IMMEDIATE');try{
   this.actor(actor);const current=this.snapshot(),next=copy(current.data),at=this.time(),event=fn(next,current,at);next.keys.push(event);capacity(next);
   this.db.prepare('UPDATE workspace SET revision=?,payload=? WHERE id=1').run(current.revision+1,JSON.stringify(next));this.db.prepare('INSERT INTO audit(requestKey,at,actor,action) VALUES(?,?,?,?)').run(event.key,at,actor.name,event.action);this.db.exec('COMMIT');return this.snapshot();
  }catch(e){this.db.exec('ROLLBACK');if(!e.status)e.status=400;throw e;}
 }
 command(input,actor){
  return this.transact(actor,(d,current,at)=>{
   ensure(input&&Object.hasOwn(fields,input.action));keys(input,['action','revision','requestKey',...fields[input.action]]);integer(input.revision,0);uuid(input.requestKey);role(actor,n=>this.roleFor(n),input.action);ensure(current.revision===input.revision,409);this.fresh(d,input.requestKey,at);
   const payload=normalized(input.action,Object.fromEntries(fields[input.action].map(k=>[k,input[k]])));apply(d,input.action,payload,actor,input.requestKey,at);return {key:input.requestKey,at,actor:actor.name,action:input.action,payload};
  });
 }
 evaluate(id,actor){this.actor(actor);uuid(id);const {revision,data}=this.snapshot(),pub=publication(data,id),results=data.profiles.filter(p=>p.archivedAt===null).map(p=>{const v=p.versions.at(-1);return {id:p.id,code:p.code,version:v.version,content:v.content,...match(pub.content,v.content)};}).sort((a,b)=>a.code<b.code?-1:1);return {revision,publication:pub,results};}
 backup(actor){this.actor(actor,true);return {format:'irik-list-v1',data:this.snapshot().data};}
 restore(input,actor){
  return this.transact(actor,(d,current,at)=>{
   this.actor(actor,true);keys(input,['backup','revision','requestKey']);integer(input.revision,0);uuid(input.requestKey);ensure(input.revision===current.revision&&Object.values(d).every(v=>v.length===0),409);keys(input.backup,['format','data']);ensure(input.backup.format==='irik-list-v1');
   const restored=copy(input.backup.data);try{replay(restored,n=>this.roleFor(n),at);}catch{ensure(false,400);}this.fresh(restored,input.requestKey,at);Object.assign(d,restored);return {key:input.requestKey,at,actor:actor.name,action:'restore',payload:{}};
  });
 }
 async backupFile(path){return sqliteBackup(this.db,path);}
}
